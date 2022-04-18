import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { of, Observable, interval } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import produce, { Draft } from 'immer';

import { ILTCourseCreationStep } from '../../../../../../../../../../libs/shared/src/lib/models/courses/ilt-courses/ilt-course-create-step.model';
import { GoToILTCourseCreationStep, UpdatePreILTCourse } from '../../state/ilt-course-create.actions';
import {IGlobalStateModel} from "../../../../../../state/state.model";

import {
  CourseCategory,
  CourseSubCategory,
  IKeyValuePair, PreILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models";
import {
  COURSE_WAITING_LIST_LIMIT,
  DEFAULT_QUILL_EDITOR_CONFIG
} from "../../../../../../../../../../libs/shared/src/lib/models/constants";
import {AdminCoursesService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";

@Component({
  selector: 'leap-ilt-course-create-details',
  templateUrl: './ilt-course-create-details.component.html',
  styleUrls: ['./ilt-course-create-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseCreateDetailsComponent implements OnInit {
  @Input() preCourse: PreILTCourse;

  @Select((state: IGlobalStateModel) => state.core.courseLevelDictionary)
  courseLevelDictionary$: Observable<IKeyValuePair[]>;

  quillConfig = DEFAULT_QUILL_EDITOR_CONFIG;
  readonly COURSE_WAITING_LIST_LIMIT = COURSE_WAITING_LIST_LIMIT;
  keywordsControlOptions$: Observable<IKeyValuePair[]>;
  readonly richTextCharLimit = 1500;
  readonly textInputCharLimit = 256;
  updating: boolean;
  form: FormGroup;
  defaultLevel = '';

  get isDisabledClearSection(): boolean {
    return this.form.get('levelId').value === this.defaultLevel;
  }

  get minLearnersControl(): FormControl {
    return this.form.get('minLearners') as FormControl;
  }

  get maxLearnersControl(): FormControl {
    return this.form.get('maxLearners') as FormControl;
  }

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

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      minLearners: [1, Validators.required],
      maxLearners: [1, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(this.richTextCharLimit)]],
      objectives: ['', Validators.maxLength(this.richTextCharLimit)],
      targetAudience: ['', Validators.maxLength(this.richTextCharLimit)],
      category: [null, Validators.required],
      subcategory: [null, Validators.required],
      keywords: [],
      levelId: [null],
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

    this.keywordsControlOptions$ = of(this.preCourse.expressCourse.keywords.map((k) => ({ key: k, value: k })));
    this.patchForm();

    this.minLearnersControl.valueChanges.pipe(untilDestroyed(this)).subscribe((value: number) => {
      if (value > this.maxLearnersControl.value) {
        this.maxLearnersControl.patchValue(value);
      }
    });

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
    this.store.dispatch(new GoToILTCourseCreationStep({ step: ILTCourseCreationStep.MATERIALS }));
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();

    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const updatedCourse = this.prepareUpdatePayload(formValue);

      this.updating = true;
      this.store
        .dispatch(new UpdatePreILTCourse({ updatedCourse, step: ILTCourseCreationStep.DETAILS }))
        .pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.updating = false;
            this.store.dispatch(new GoToILTCourseCreationStep({ step: ILTCourseCreationStep.AGENDA }));
          },
          () => (this.updating = false),
        );
    }
  }

  private patchForm(): void {
    const {
      expressCourse: {
        minStudents,
        maxSeats,
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
        externalSKU,
      },
    } = this.preCourse;

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
      minLearners: minStudents ?? 1,
      maxLearners: maxSeats ?? 1,
      description,
      objectives,
      targetAudience,
      category,
      subcategory,
      keywords,
      levelId: level?.id || this.defaultLevel,
      externalSKU,
    });

    if (objectives) {
      this.objectivesControl.enable({
        onlySelf: true,
        emitEvent: false,
      });
    }

    if (targetAudience) {
      this.targetAudienceControl.enable({
        onlySelf: true,
        emitEvent: false,
      });
    }
  }

  private prepareUpdatePayload(formValue: {
    minLearners: number;
    maxLearners: number;
    description: string;
    objectives: string;
    targetAudience: string;
    category: CourseCategory;
    subcategory: CourseSubCategory;
    keywords: string[];
    levelId: string;
    externalSKU: string;
  }): PreILTCourse {
    return produce(this.preCourse, (draft: Draft<PreILTCourse>) => {
      draft.expressCourse.maxSeats = formValue.maxLearners;
      draft.expressCourse.minStudents = formValue.minLearners;
      draft.expressCourse.categoryId = formValue.category?.id ?? null;
      draft.expressCourse.categoryName = formValue.category?.name ?? null;
      draft.expressCourse.categoryCode = formValue.category?.code ?? null;
      draft.expressCourse.subcategoryId = formValue.subcategory?.id;
      draft.expressCourse.subcategoryName = formValue.subcategory?.name;
      draft.expressCourse.subcategoryCode = formValue.subcategory?.code;
      draft.expressCourse.keywords = formValue.keywords;
      draft.expressCourse.description = formValue.description;
      draft.expressCourse.objectives = formValue.objectives;
      draft.expressCourse.targetAudience = formValue.targetAudience;
      draft.expressCourse.level = formValue.levelId ? { id: formValue.levelId } : null;
      draft.expressCourse.externalSKU = formValue.externalSKU ?? null;
      draft.tab = ILTCourseCreationStep.DETAILS;
    });
  }
}
