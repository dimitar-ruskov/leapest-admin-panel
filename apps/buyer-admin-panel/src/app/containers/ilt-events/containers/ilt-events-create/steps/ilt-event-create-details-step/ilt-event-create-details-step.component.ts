import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { interval, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import produce from 'immer';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { ILTEventCreationStep } from '../../models/ilt-event-create-step.model';
import { GoToEventCreationStep, UpdateILTEventDetails } from '../../state/ilt-events-create.actions';

import {
  IKeyValuePair,
  ILTEvent, ITrainingManager,
  LearnersBulkImportResponse
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {COURSE_WAITING_LIST_LIMIT} from "../../../../../../../../../../libs/shared/src/lib/models/constants";
import {
  EnvironmentService,
  UploadService
} from "../../../../../../../../../../libs/shared/src/lib/utils/services/common";
import {AdminCoursesService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";

@Component({
  selector: 'leap-ilt-event-create-details-step',
  templateUrl: './ilt-event-create-details-step.component.html',
  styleUrls: ['./ilt-event-create-details-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventCreateDetailsStepComponent implements OnInit {
  @Input() iltEvent: ILTEvent;

  updating = false;

  iltLanguageDictionary$: Observable<IKeyValuePair[]>;

  trainingManagers$: Observable<ITrainingManager[]>;

  detailsForm: FormGroup;

  today = new Date();
  minValue = 1;
  maxValue = 1;
  readonly COURSE_WAITING_LIST_LIMIT = COURSE_WAITING_LIST_LIMIT;

  selfRegistrationOptions: { key: boolean; value: string }[] = [
    {
      key: true,
      value: 'Yes, learners can register themselves for this course event',
    },
    {
      key: false,
      value: 'No, learners will be manually assigned by an admin or training manager',
    },
  ];

  registrationApprovalOptions: { key: boolean; value: string }[] = [
    {
      key: true,
      value: 'Yes, a training manager must approve registrations',
    },
    {
      key: false,
      value: 'No, approval is not required',
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminCourseService: AdminCoursesService,
    private readonly store: Store,
    private readonly detector: ChangeDetectorRef,
    private readonly modalService: NzModalService,
    public environmentService: EnvironmentService,
    private readonly uploadService: UploadService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get selfRegistrationControl(): FormControl {
    return this.detailsForm.get('selfRegistration') as FormControl;
  }

  get waitingListEnabledControl(): FormControl {
    return this.detailsForm.get('waitingListEnabled') as FormControl;
  }

  get trainingManagersControl(): FormControl {
    return this.detailsForm.get('trainingManagers') as FormControl;
  }

  get registrationApprovalControl(): FormControl {
    return this.detailsForm.get('registrationApproval') as FormControl;
  }

  trainingManagersDropdownOpen = false;
  formInited = false;
  formInited2 = false;
  allCountries: IKeyValuePair[];
  uploading = false;
  bulkUploadErrors: LearnersBulkImportResponse[];
  uploadedFile: File;

  readonly allowedUploadFormats = '.csv';
  readonly allowedUploadSize = 200;
  readonly textInputCharLimit = 256;
  readonly bucket = 'itpx-test-uploads';

  ngOnInit(): void {
    this.iltLanguageDictionary$ = this.adminCourseService.getDeliveryLanguages();
    this.trainingManagers$ = this.adminCourseService.getTrainingManagers().pipe(
      map((t) =>
        t.data.map((d) => {
          const tm = {
            trainingManagerId: d.employeeId,
            trainingManagerEmail: d.email,
            trainingManagerName: d.firstName + ' ' + d.lastName,
          };
          return tm;
        }),
      ),
    );

    const group: any = {
      language: [this.iltEvent.language.id, Validators.required],
      trainingManagers: [this.iltEvent.trainingManagers || [], Validators.required],
      minLearners: [this.iltEvent.course.minStudents, Validators.required],
      maxLearners: [this.iltEvent.course.maxSeats, Validators.required],
      selfRegistration: [this.iltEvent.selfRegistration, Validators.required],
      registrationApproval: [this.iltEvent.isInternal ? !this.iltEvent.course.automaticApproval : false],
      waitingListEnabled: [!!this.iltEvent.course.waitingList],
      waitingListSize: [this.iltEvent.course.waitingListSize ? this.iltEvent.course.waitingListSize : 1],
      csvKey: [null, this.iltEvent.historical ? Validators.required : null],
      csvBucket: [null, this.iltEvent.historical ? Validators.required : null],
    };

    if (this.iltEvent.course.specificExternalSKU) {
      group.externalSKU = [
        null,
        [Validators.pattern(/^[A-Z0-9]+$/i), Validators.minLength(4), Validators.maxLength(8)],
        [this.adminCourseService.existingSKUAsyncValidator(true)],
      ];
    } else {
      group.externalSKU = [
        this.iltEvent.course.externalSKU || null,
        [Validators.maxLength(this.textInputCharLimit)],
        [this.adminCourseService.existingSKUAsyncValidator()],
      ];
    }

    this.detailsForm = this.fb.group(group);

    this.selfRegistrationControl.valueChanges
      .pipe(startWith(this.selfRegistrationControl.value), untilDestroyed(this))
      .subscribe((val) => {
        if (val) {
          this.registrationApprovalControl.setValidators(Validators.required);
        } else {
          this.registrationApprovalControl.setValidators(null);
        }
      });

    this.trainingManagersControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((_) => (this.trainingManagersDropdownOpen = false));

    this.detailsForm
      .get('minLearners')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((model: number) => {
        if (this.detailsForm.get('minLearners').value > this.detailsForm.get('maxLearners').value) {
          this.detailsForm.patchValue({
            maxLearners: model,
          });
        }
      });

    // Fix for form's PENDING state, caused by async validator.
    this.detailsForm.statusChanges
      .pipe(
        untilDestroyed(this),
        switchMap(() => interval(250)),
        map(() => this.detailsForm.status),
        distinctUntilChanged(),
      )
      .subscribe(() => this.cdr.detectChanges());
  }

  onBack(): void {
    this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.MATERIALS));
  }

  onProceed(): void {
    const details = this.formatRequest();
    this.updating = true;
    this.store
      .dispatch([new UpdateILTEventDetails(details, 'details')])
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.AGENDA));
        },
        () => (this.updating = false),
      );
  }

  private formatRequest(): ILTEvent {
    const formData = this.detailsForm.getRawValue();
    const cancellationPolicy = {
      policyConfig: {
        configKey: 'very-strict',
      },
    };
    const payload = produce(this.iltEvent, (details: ILTEvent) => {
      details.language = { id: formData.language };
      details.course.minStudents = formData.minLearners;
      details.course.maxSeats = formData.maxLearners;
      details.trainingManagers = formData.trainingManagers;
      details.selfRegistration = formData.selfRegistration;
      details.course.automaticApproval = !(formData.selfRegistration && formData.registrationApproval);
      details.course.waitingList = formData.waitingListEnabled && formData.selfRegistration;
      details.course.waitingListSize = details.course.waitingList ? formData.waitingListSize : 1;
      details.automaticCourseCompletion = false;
      details.csvBucket = formData.csvBucket;
      details.csvKey = formData.csvKey;
      details.course.externalSKU = formData.externalSKU;
      if (!this.iltEvent.isInternal) {
        details.course.cancellationPolicy = cancellationPolicy;
      }
    });

    return payload;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  public csvTemplateDownload(): void {
    window.open(
      'https://itpx-public.s3-eu-west-1.amazonaws.com/historicalEventForm.csv',
      '_blank',
      'noopener,noreferrer',
    );
  }

  public beforeUpload = (file: File): boolean => {
    const parts = file.name.split('.');
    const ext = `.${parts[parts.length - 1]}`;
    const allowedFormat = this.allowedUploadFormats.split(',').includes(ext); // add notification
    const isLtM = file.size / 1024 / 1024 < this.allowedUploadSize; // add notification
    return allowedFormat && isLtM;
  };

  public uploadFile = (event: any): void => {
    this.uploadService
      .upload(event.file, this.environmentService.s3Storage)
      .pipe(
        switchMap((resp) => {
          this.uploading = true;
          this.cdr.detectChanges();
          if (resp.type === 'success') {
            event.onSuccess(event.data);
            this.uploading = false;
            this.bulkUploadErrors = null;
            this.uploadedFile = event.file;
            this.detailsForm.get('csvKey').patchValue(resp.key);
            this.detailsForm.get('csvBucket').patchValue(resp.bucket);
            this.cdr.detectChanges();
            return this.adminCourseService.learnersBulkImport({ key: resp.key, bucket: resp.bucket }, this.iltEvent.id);
          }
          return of(null);
        }),
      )
      .subscribe((resp: LearnersBulkImportResponse[]) => {
        if (resp) {
          this.bulkUploadErrors = resp;
          this.cdr.detectChanges();
        }
      });
  };

  public removeCSV(): void {
    this.uploadedFile = null;
    this.bulkUploadErrors = null;
    this.detailsForm.get('csvKey').reset();
    this.detailsForm.get('csvBucket').reset();
  }

  removeTM(i: number): void {
    const newVal = [...this.trainingManagersControl.value];
    newVal.splice(i, 1);
    this.trainingManagersControl.markAsDirty();
    this.trainingManagersControl.patchValue(newVal);
  }
}
