import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { interval, Observable, of } from "rxjs";
import { distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import produce, { Draft } from "immer";

import { GoToSPCourseCreationStep, UpdatePreSelfPacedCourse } from "../../state/sp-course-create.actions";
import { IGlobalStateModel } from "../../../../../../state/state.model";

import {
  CourseCategory,
  CourseSubCategory,
  DEFAULT_QUILL_EDITOR_CONFIG,
  IKeyValuePair,
  ITrainingManager,
  PreSelfPacedCourse,
  REGISTRATION_APPROVAL_OPTIONS_MAP,
  SELF_REGISTRATION_OPTIONS_MAP,
  SPCourseCreationSteps
} from "../../../../../../../../../../libs/shared/src/lib/models";
import { getOptionsFromMap } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  AdminCoursesService
} from "../../../../../../../../../../libs/shared/src/lib/services/events/admin-courses.service";

@Component({
  selector: 'leap-sp-course-create-details',
  templateUrl: './sp-course-create-details.component.html',
  styleUrls: ['./sp-course-create-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseCreateDetailsComponent implements OnInit {
  @Input() preSelfPacedCourse: PreSelfPacedCourse;

  @Select((state: IGlobalStateModel) => state.core.courseLevelDictionary)
  courseLevelDictionary$: Observable<IKeyValuePair[]>;

  quillConfig = DEFAULT_QUILL_EDITOR_CONFIG;
  charLimit = 1500;
  textInputCharLimit = 256;
  keywordsControlOptions$: Observable<IKeyValuePair[]>;
  trainingManagers$: Observable<ITrainingManager[]>;

  selfRegistrationOptions: IKeyValuePair[] = [];
  registrationApprovalOptions: IKeyValuePair[] = [];

  isAutomaticApprovalControlVisible = true;
  updating: boolean;
  form: FormGroup;
  defaultLevel = '';

  get isDisabledClearSection(): boolean {
    return !this.form.get('levelId').value;
  }

  trainingManagersDropdownOpen = false;

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get objectivesControl(): FormControl {
    return this.form.get('objectives') as FormControl;
  }

  get targetAudienceControl(): FormControl {
    return this.form.get('targetAudience') as FormControl;
  }

  get categoryControl(): FormControl {
    return this.form.get('category') as FormControl;
  }

  get keywordsControl(): FormControl {
    return this.form.get('keywords') as FormControl;
  }

  get selfRegistrationControl(): FormControl {
    return this.form.get('selfRegistration') as FormControl;
  }

  get automaticApprovalControl(): FormControl {
    return this.form.get('automaticApproval') as FormControl;
  }

  get trainingManagersControl(): FormControl {
    return this.form.get('trainingManagers') as FormControl;
  }

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      description: ['', Validators.maxLength(this.charLimit)],
      objectives: ['', Validators.maxLength(this.charLimit)],
      targetAudience: ['', Validators.maxLength(this.charLimit)],
      category: [null, Validators.required],
      subcategory: [null, Validators.required],
      keywords: [],
      levelId: [null, Validators.required],
      trainingManagers: [null, Validators.required],
      selfRegistration: [null, Validators.required],
      automaticApproval: [null],
      externalSKU: [
        null,
        [Validators.maxLength(this.textInputCharLimit)],
        [this.adminCoursesService.existingSKUAsyncValidator()],
      ],
    });
    this.objectivesControl.disable();
    this.targetAudienceControl.disable();
  }

  ngOnInit(): void {
    this.courseLevelDictionary$.pipe(untilDestroyed(this)).subscribe((levels) => {
      this.defaultLevel = levels[0].key;
    });

    this.selfRegistrationOptions = getOptionsFromMap(SELF_REGISTRATION_OPTIONS_MAP);
    this.registrationApprovalOptions = getOptionsFromMap(REGISTRATION_APPROVAL_OPTIONS_MAP);
    this.keywordsControlOptions$ = of(
      this.preSelfPacedCourse.expressCourse.keywords.map((k) => ({ key: k, value: k })),
    );
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

    this.subscribeToSelfRegistration();
    this.patchForm();

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

  clearSection(): void {
    this.form.get('levelId').setValue(this.defaultLevel);
  }

  toggleControlVisibility(event: MouseEvent, control: FormControl, visible: boolean): void {
    event.stopPropagation();
    const config = { onlySelf: true };

    if (visible) {
      control.enable(config);
    } else {
      control.reset('');
      control.disable(config);
    }
  }

  onInputKeyword(searchValue: string): void {
    if (searchValue) {
      this.keywordsControlOptions$ = this.adminCoursesService.getAgoraKeywords(searchValue).pipe(map((t) => t.data));
    }
  }

  onRemoveKeyword(key: string): void {
    const keywordsValue = [...this.keywordsControl.value];
    const keywordIndex = keywordsValue.findIndex((k) => k === key);

    keywordsValue.splice(keywordIndex, 1);

    this.keywordsControl.patchValue(keywordsValue);
  }

  onBack(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(new GoToSPCourseCreationStep({ step: SPCourseCreationSteps.MATERIALS }));
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();

    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const updatedCourse = this.prepareUpdatePayload(formValue);

      this.updating = true;
      this.store
        .dispatch(
          new UpdatePreSelfPacedCourse({
            updatedCourse,
            step: SPCourseCreationSteps.DETAILS,
          }),
        )
        .pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.updating = false;
            this.store.dispatch(new GoToSPCourseCreationStep({ step: SPCourseCreationSteps.SUMMARY }));
          },
          () => (this.updating = false),
        );
    }
  }

  private patchForm(): void {
    const {
      expressCourse: {
        description,
        objectives,
        targetAudience,
        categoryId,
        categoryName,
        categoryCode,
        subcategoryId,
        subcategoryName,
        subcategoryCode,
        keywords,
        level,
        selfRegistration,
        trainingManagers,
        automaticApproval,
        externalSKU,
      },
    } = this.preSelfPacedCourse;

    const category = categoryId
      ? {
          id: categoryId,
          name: categoryName,
          code: categoryCode,
        }
      : null;
    const subcategory = subcategoryId
      ? {
          id: subcategoryId,
          name: subcategoryName,
          code: subcategoryCode,
        }
      : null;

    this.form.patchValue({
      description,
      objectives,
      targetAudience,
      category,
      subcategory,
      keywords,
      levelId: level?.id || this.defaultLevel,
      trainingManagers,
      selfRegistration,
      automaticApproval: automaticApproval ?? true,
      externalSKU,
    });

    const options = {
      onlySelf: true,
      emitEvent: false,
    };

    if (objectives) {
      this.objectivesControl.enable(options);
    }

    if (targetAudience) {
      this.targetAudienceControl.enable(options);
    }
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

  removeTM(i: number): void {
    const newVal = [...this.trainingManagersControl.value];
    newVal.splice(i, 1);
    this.trainingManagersControl.markAsDirty();
    this.trainingManagersControl.patchValue(newVal);
  }

  private prepareUpdatePayload(formValue: {
    description: string;
    objectives: string;
    targetAudience: string;
    category: CourseCategory;
    subcategory: CourseSubCategory;
    keywords: string[];
    levelId: string;
    trainingManagers;
    selfRegistration: boolean;
    automaticApproval: boolean;
    externalSKU: string;
  }): PreSelfPacedCourse {
    return produce(this.preSelfPacedCourse, (draft: Draft<PreSelfPacedCourse>) => {
      draft.expressCourse.categoryId = formValue.category?.id ?? null;
      draft.expressCourse.categoryName = formValue.category?.name ?? null;
      draft.expressCourse.categoryCode = formValue.category?.code ?? null;
      draft.expressCourse.subcategoryId = formValue.subcategory?.id;
      draft.expressCourse.subcategoryName = formValue.subcategory?.name;
      draft.expressCourse.subcategoryCode = formValue.subcategory?.code;
      draft.expressCourse.keywords = formValue.keywords;
      draft.expressCourse.description = formValue.description;
      draft.expressCourse.objectives = formValue.description;
      draft.expressCourse.targetAudience = formValue.targetAudience;
      draft.expressCourse.level = formValue.levelId ? { id: formValue.levelId } : null;
      draft.expressCourse.trainingManagers = formValue.trainingManagers;
      draft.expressCourse.selfRegistration = formValue.selfRegistration;
      draft.expressCourse.automaticApproval = formValue.automaticApproval;
      draft.expressCourse.externalSKU = formValue.externalSKU ?? null;
      draft.tab = SPCourseCreationSteps.DETAILS;
    });
  }
}
