import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

import {IKeyValuePair, ILTEvent, ILTEventLearner, TFormControlConfigOption} from "../../../models/interfaces";
import {SPCourseLanguageVariant} from "../../../models/interfaces/sp-courses/sp-course.model";
import {EnvironmentService, UploadService} from "../../../utils/services/common";
import {
  SPCourseLanguageVariantLearner
} from "../../../models/interfaces/sp-courses/sp-course-language-variant-learner.model";
import {AdminCoursesService, LxpUsersService} from "../../../utils/services";

@Component({
  selector: 'leap-assign-users-modal',
  templateUrl: './assign-users-modal.component.html',
  styleUrls: ['./assign-users-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignUsersModalComponent implements OnInit {
  @Input() data: ILTEvent | SPCourseLanguageVariant;
  @Input() waitingList: boolean;
  @Input() waitingListTotal: number;

  lxpUsers$: Observable<IKeyValuePair[]>;
  lxpGroups$: Observable<IKeyValuePair[]>;
  lxpGroupUsers: IKeyValuePair[] = [];
  typeOptions: TFormControlConfigOption[] = [
    {
      key: 'lxp',
      value: 'Choose users from LXP List',
      extra: 'Assign learner individually from your LXP.',
    },
    {
      key: 'lxp_groups',
      value: 'Choose users from LXP Group',
      extra: 'Select an LXP Group to assign learners.',
    },
    {
      key: 'csv',
      value: 'Upload users via CSV file',
      extra: 'Assign learners in bulk by uploading CSV file.',
    },
    {
      key: 'mail',
      value: 'Assign Users via email',
      extra: 'Assign learners individually via email.',
    },
  ];

  remainingSeatsMessages = {
    warning:
      'All seats for this event are currently filled. To assign any new users, consider Editing the event capacity or removing learners.',
    error:
      'You have exceeded the capacity of this event. To assign any new users, consider Editing the event capacity or removing learners.',
  };

  waitingListSeatsMessages = {
    warning:
      'All seats on waiting list for this event are currently filled. To assign any new users, consider Editing the waiting list for this event capacity or removing learners.',
    error:
      'You have exceeded the capacity of waiting list for this event. To assign any new users, consider Editing the waiting list for this event capacity or removing learners.',
  };

  form: FormGroup;
  typeControl: FormControl;
  lxpUsersControl: FormControl;
  lxpGroupsControl: FormControl;
  emailUsersControl: FormControl;
  emailControl: FormControl;
  errorMessage: string;
  bulkLearners: ILTEventLearner[] | SPCourseLanguageVariantLearner[];
  numberOfUsersInCsv: number;
  numberOfUsersInGroup = 0;
  uploading = false;
  invalidCSV = false;
  uploadedFile: File;

  readonly allowedUploadFormats: string = '.csv';
  readonly bucket: string = 'itpx-test-uploads';

  private s3Key: string;
  private s3Bucket: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly lxpUsersService: LxpUsersService,
    private readonly cdr: ChangeDetectorRef,
    public environmentService: EnvironmentService,
    private readonly uploadService: UploadService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      type: [{ value: null, disabled: false }, Validators.required],
      lxpUsers: [[]],
      lxpGroups: [[]],
      emailUsers: [[]],
      email: [null, Validators.email],
    });
    this.typeControl = this.form.get('type') as FormControl;
    this.lxpUsersControl = this.form.get('lxpUsers') as FormControl;
    this.lxpGroupsControl = this.form.get('lxpGroups') as FormControl;
    this.emailUsersControl = this.form.get('emailUsers') as FormControl;
    this.emailControl = this.form.get('email') as FormControl;

    this.lxpGroupsControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap((groupId: string) => {
          return this.lxpUsersService.getLxpUsersByGroupId(groupId);
        }),
      )
      .subscribe((groupUsers: IKeyValuePair[]) => {
        this.lxpGroupUsers = groupUsers;
        this.numberOfUsersInGroup = groupUsers.length;
        this.cdr.detectChanges();
      });

    // @ToDo will removed after reducing eMails assign everywhere
    if (this.waitingList) {
      this.typeOptions = this.typeOptions.filter((type) => type.key !== 'mail');
      this.cdr.detectChanges();
    }
  }

  get lxpUsersCount(): number {
    return this.lxpUsersControl && this.lxpUsersControl.value ? this.lxpUsersControl.value.length : 0;
  }

  get emailUsersCount(): number {
    return this.emailUsersControl && this.emailUsersControl.value ? this.emailUsersControl.value.length : 0;
  }

  get usersCount(): number {
    return this.lxpUsersCount + this.emailUsersCount + this.numberOfUsersInGroup;
  }

  get remainingWaitingListSeats(): number {
    return this.data.course.waitingListSize - this.waitingListTotal;
  }

  get validateLearners(): boolean {
    const checkCount = this.bulkLearners ? this.numberOfUsersInCsv : this.usersCount;
    return !checkCount || this.data.remainingSeats < checkCount;
  }

  get validateWaitingList(): boolean {
    const checkCount = this.bulkLearners ? this.numberOfUsersInCsv : this.usersCount;
    return !checkCount || this.remainingWaitingListSeats < checkCount;
  }

  setErrorMessage(alreadyEnrolledUsers?: string[], arrayInvalidLearners?: string[]): void {
    if (!alreadyEnrolledUsers && !arrayInvalidLearners) {
      this.errorMessage = null;
      return;
    }

    if (arrayInvalidLearners?.length) {
      this.errorMessage = `The following user(s) are already enrolled to another event of this course: ${arrayInvalidLearners.join(
        ', ',
      )}`;
    } else if (alreadyEnrolledUsers?.length) {
      this.errorMessage = `${alreadyEnrolledUsers.join(
        ', ',
      )} is already enrolled for this course event and can't be assigned to the waiting list.`;
    }
    this.cdr.detectChanges();
  }

  onInputLxpUsers(filter: string): void {
    if (filter && filter.length > 2) {
      this.lxpUsers$ = this.lxpUsersService.getLxpUsers(filter);
    }
  }

  onInputLxpGroups(filter: string): void {
    if (filter && filter.length > 2) {
      this.lxpGroups$ = this.lxpUsersService.getLxpGroups(filter);
    }
  }

  addEmail(key: any): void {
    this.emailControl.updateValueAndValidity();
    if (!this.emailControl.valid) {
      return;
    }
    const email = this.emailControl.value;
    const lxpUsers = (this.lxpUsersControl.value as string[]) || [];
    const emailUsers = (this.emailUsersControl.value as string[]) || [];
    const indexOfExisting = emailUsers.indexOf(email) < 0 && lxpUsers.indexOf(email) < 0;
    if (indexOfExisting) {
      emailUsers.push(email);
      this.emailUsersControl.patchValue(emailUsers);
    }
    this.form.get('email').patchValue(null);
  }

  onRemoveUser(val, key: string) {
    let kValue;
    let kIndex;
    switch (key) {
      case 'lxp':
        kValue = [...this.lxpUsersControl.value];
        kIndex = kValue.findIndex((k) => k === val);
        kValue.splice(kIndex, 1);
        this.lxpUsersControl.patchValue(kValue);
        break;
      case 'email':
        kValue = [...this.emailUsersControl.value];
        kIndex = kValue.findIndex((k) => k === val);
        kValue.splice(kIndex, 1);
        this.emailUsersControl.patchValue(kValue);
        break;
    }
    this.setErrorMessage();
  }

  beforeUpload = (file: File) => {
    const parts = file.name.split('.');
    const ext = `.${parts[parts.length - 1]}`;
    const allowedFormat = this.allowedUploadFormats.split(',').includes(ext); // add notification
    return allowedFormat;
  };

  uploadFile = (event: any) => {
    this.uploadService.upload(event.file, this.environmentService.s3Storage).subscribe(
      (resp) => {
        if (resp.type === 'started') {
          this.uploading = true;
          this.cdr.detectChanges();
        }
        if (resp.type === 'progress') {
          event.onProgress(resp.progress);
        } else if (resp.type === 'success') {
          event.onSuccess(event.data);
          this.onUploadCSV(resp, event.file);
        }
      },
      (error) => {
        event.onError(error);
        this.uploading = false;
        this.cdr.detectChanges();
      },
    );
  };

  csvTemplateDownload(): void {
    window.open(
      'https://itpx-public.s3-eu-west-1.amazonaws.com/employee_import_template.csv',
      '_blank',
      'noopener,noreferrer',
    );
  }

  removeCSV(): void {
    this.bulkLearners = null;
    this.numberOfUsersInCsv = null;
    this.uploadedFile = null;
    this.typeControl.enable();
    this.setErrorMessage();
  }

  deleteCsvLearner(index: number): void {
    this.bulkLearners.splice(index, 1);
    this.bulkLearners = [...this.bulkLearners];
    this.numberOfUsersInCsv--;
  }

  deleteLxpGroupLearner(index: number): void {
    this.lxpGroupUsers.splice(index, 1);
    this.lxpGroupUsers = [...this.lxpGroupUsers];
    this.numberOfUsersInGroup--;
  }

  private onUploadCSV(response: any, file: File) {
    const rootCsvKey = response.key;
    const rootCsvBucket = response.bucket;
    this.s3Key = rootCsvKey;
    this.s3Bucket = rootCsvBucket;
    this.adminCoursesService
      .validateLearnerCSV(this.data.id, { bucket: this.s3Bucket, key: this.s3Key }, this.waitingList)
      .subscribe((res) => {
        this.uploading = false;
        if (!res || !res.csvImportValid) {
          this.invalidCSV = true;
          this.cdr.detectChanges();
          return;
        }
        this.lxpUsersControl.reset();
        this.emailUsersControl.reset();
        this.numberOfUsersInCsv = res.numberofUsersInCsv;
        this.bulkLearners = res.learners;
        this.invalidCSV = false;
        this.uploadedFile = file;
        this.typeControl.disable();
        this.cdr.detectChanges();
      });
  }
}
