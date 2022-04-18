import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, interval, Observable } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";
import produce from "immer";

import {
  GoToSPCourseLanguageVariantCreationStep,
  UpdatePreSPCourseLanguageVariant
} from "../../state/sp-course-variant-create.actions";

import {
  COURSE_COMPLETION_OPTIONS_MAP,
  IKeyValuePair,
  PreSPCourseLanguageVariant,
  REGISTRATION_APPROVAL_OPTIONS_MAP,
  SELF_REGISTRATION_OPTIONS_MAP,
  SPCourseLanguageVariantCreationSteps
} from "../../../../../../../../../../../../../libs/shared/src/lib/models";
import { getOptionsFromMap } from "../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  AdminCoursesService
} from "../../../../../../../../../../../../../libs/shared/src/lib/services/events/admin-courses.service";


@Component({
  selector: 'leap-sp-course-variant-create-details',
  templateUrl: './sp-course-variant-create-details.component.html',
  styleUrls: ['./sp-course-variant-create-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseVariantCreateDetailsComponent implements OnInit, OnDestroy {
  @Input() preSPCourseLanguageVariant: PreSPCourseLanguageVariant;

  trainingManagers$: Observable<
    { trainingManagerId: string; trainingManagerEmail: string; trainingManagerName: string }[]
  >;

  selfRegistrationOptions: IKeyValuePair[] = [];
  registrationApprovalOptions: IKeyValuePair[] = [];
  courseCompletionOptions: IKeyValuePair[] = [];

  form: FormGroup;

  textInputCharLimit = 256;
  isAutomaticApprovalControlVisible = true;
  updatingSubject = new BehaviorSubject<boolean>(false);

  get trainingManagersControl(): FormControl {
    return this.form.get('trainingManagers') as FormControl;
  }

  trainingManagersDropdownOpen = false;

  get updating$(): Observable<boolean> {
    return this.updatingSubject.asObservable();
  }

  get selfRegistrationControl(): FormControl {
    return this.form.get('selfRegistration') as FormControl;
  }

  get automaticApprovalControl(): FormControl {
    return this.form.get('automaticApproval') as FormControl;
  }

  get automaticCourseCompletionControl(): FormControl {
    return this.form.get('automaticCourseCompletion') as FormControl;
  }

  trainingManagerCompareFn = (
    o1: { id: string; email: string; name: string },
    o2: { id: string; email: string; name: string },
  ) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    const group: any = {
      trainingManagers: [[], Validators.required],
      selfRegistration: [true, Validators.required],
      automaticApproval: [true, Validators.required],
      automaticCourseCompletion: [true, Validators.required],
      reviewsEnabled: [true, Validators.required],
    };

    if (this.preSPCourseLanguageVariant.course.specificExternalSKU) {
      group.externalSKU = [
        null,
        [Validators.pattern(/^[A-Z0-9]+$/i), Validators.minLength(4), Validators.maxLength(8)],
        [this.adminCoursesService.existingSKUAsyncValidator(true)],
      ];
    } else {
      group.externalSKU = [
        this.preSPCourseLanguageVariant.course.externalSKU || null,
        [Validators.maxLength(this.textInputCharLimit)],
        [this.adminCoursesService.existingSKUAsyncValidator()],
      ];
    }

    this.form = this.fb.group(group);

    this.selfRegistrationOptions = getOptionsFromMap(SELF_REGISTRATION_OPTIONS_MAP);
    this.registrationApprovalOptions = getOptionsFromMap(REGISTRATION_APPROVAL_OPTIONS_MAP);
    this.courseCompletionOptions = getOptionsFromMap(COURSE_COMPLETION_OPTIONS_MAP);

    this.trainingManagers$ = this.adminCoursesService.getTrainingManagers().pipe(
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
    this.patchForm();
    this.subscribeToSelfRegistration();
    this.trainingManagersControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((_) => (this.trainingManagersDropdownOpen = false));

    // Fix for form's PENDING state, caused by async validator.
    this.form.statusChanges
      .pipe(
        untilDestroyed(this),
        switchMap(() => interval(250)),
        map(() => this.form.status),
        distinctUntilChanged(),
      )
      .subscribe(() => this.cdr.detectChanges());
  }

  ngOnDestroy(): void {
    this.updatingSubject.complete();
  }

  onBack(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(
      new GoToSPCourseLanguageVariantCreationStep({
        step: SPCourseLanguageVariantCreationSteps.MATERIALS,
      }),
    );
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();

    this.updatingSubject.next(true);
    this.store
      .dispatch(
        new UpdatePreSPCourseLanguageVariant({
          updatedPreSPCourseLanguageVariant: this.prepareUpdatePayload(),
          step: SPCourseLanguageVariantCreationSteps.DETAILS,
        }),
      )
      .pipe(
        filter((resource) => !resource.isPending),
        untilDestroyed(this),
      )
      .subscribe(
        () => {
          this.updatingSubject.next(false);
          this.store.dispatch(
            new GoToSPCourseLanguageVariantCreationStep({
              step: SPCourseLanguageVariantCreationSteps.SUMMARY,
            }),
          );
        },
        () => this.updatingSubject.next(false),
      );
  }

  removeTM(i: number): void {
    const newVal = [...this.trainingManagersControl.value];
    newVal.splice(i, 1);
    this.trainingManagersControl.markAsDirty();
    this.trainingManagersControl.patchValue(newVal);
  }

  private patchForm(): void {
    const {
      trainingManagers,
      selfRegistration,
      course: { automaticApproval },
      automaticCourseCompletion,
      reviewsEnabled,
      mandatoryAutomaticCourseCompletion,
    } = this.preSPCourseLanguageVariant;

    const isSelfRegistrationEnabled = selfRegistration ?? true;

    this.form.patchValue({
      trainingManagers,
      selfRegistration: isSelfRegistrationEnabled,
      automaticApproval: automaticApproval ?? true,
      automaticCourseCompletion: automaticCourseCompletion ?? true,
      reviewsEnabled: reviewsEnabled ?? true,
    });

    this.isAutomaticApprovalControlVisible = isSelfRegistrationEnabled;

    if (mandatoryAutomaticCourseCompletion) {
      this.automaticCourseCompletionControl.disable();
    }
  }

  private prepareUpdatePayload(): PreSPCourseLanguageVariant {
    const {
      trainingManagers,
      selfRegistration,
      automaticApproval,
      automaticCourseCompletion,
      reviewsEnabled,
      externalSKU,
    } = this.form.getRawValue();

    return produce(this.preSPCourseLanguageVariant, (draft) => {
      draft.trainingManagers = trainingManagers;
      draft.selfRegistration = selfRegistration;
      draft.course.automaticApproval = automaticApproval;
      draft.automaticCourseCompletion = automaticCourseCompletion;
      draft.reviewsEnabled = reviewsEnabled;
      draft.course.externalSKU = externalSKU;
    });
  }

  private subscribeToSelfRegistration(): void {
    this.selfRegistrationControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((isSelfRegistrationEnabled: boolean) => {
        if (!isSelfRegistrationEnabled) {
          this.automaticApprovalControl.reset(true);
        }
        this.isAutomaticApprovalControlVisible = isSelfRegistrationEnabled;
      });
  }
}
