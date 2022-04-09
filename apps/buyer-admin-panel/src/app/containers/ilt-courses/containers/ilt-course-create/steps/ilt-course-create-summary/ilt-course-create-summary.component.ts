import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, filter, finalize } from 'rxjs/operators';
import produce from 'immer';

import { ILTCourseCreationStep } from '../../models/ilt-course-create-step.model';
import { GoToILTCourseCreationStep, UpdatePreILTCourse } from '../../state/ilt-course-create.actions';

import {
  GeneralInfoField,
  IKeyValuePair, ILTCourse,
  InternalRepositoryMaterial, PreILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {COURSE_PUBLISH_STATUS} from "../../../../../../../../../../libs/shared/src/lib/models/constants";
import {NotificationService} from "../../../../../../../../../../libs/shared/src/lib/utils/services/common";
import {AdminCoursesService, LxpUsersService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";


const NO_MATERIALS_LABEL = 'This course has no materials.';

@Component({
  selector: 'leap-ilt-course-create-summary',
  templateUrl: './ilt-course-create-summary.component.html',
  styleUrls: ['./ilt-course-create-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseCreateSummaryComponent implements OnInit {
  @Input() preCourse: PreILTCourse;

  submitting: boolean;
  fields: GeneralInfoField[] = [];
  materials: InternalRepositoryMaterial[] = [];
  noMaterialsLabel = NO_MATERIALS_LABEL;

  form: FormGroup;

  coursePublishStatus = COURSE_PUBLISH_STATUS;
  publishToLXPControl: FormControl;
  lxpPrivateControl: FormControl;
  lxpUsers$: Observable<IKeyValuePair[]>;
  lxpGroups$: Observable<IKeyValuePair[]>;
  lxpChannels$: Observable<IKeyValuePair[]>;
  lxpRestrictUsersControl: FormControl;
  lxpRestrictGroupsControl: FormControl;
  lxpRestrictChannelsControl: FormControl;
  lxpRestrictPublishGroupsControl: FormControl;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly notification: NotificationService,
    private readonly lxpUsersService: LxpUsersService,
  ) {}

  ngOnInit(): void {
    const group: any = {
      publishToLXP: [true, Validators.required],
      lxpPrivate: [true, Validators.required],
      lxpRestrictUsers: [null],
      lxpRestrictGroups: [null],
      lxpGroups: [null],
      lxpChannels: [null],
    };
    if (this.preCourse.specificExternalSKU) {
      group.externalSKU = [
        null,
        [Validators.required, Validators.pattern(/^[A-Z0-9]+$/i), Validators.minLength(4), Validators.maxLength(8)],
        this.adminCoursesService.existingSKUAsyncValidator(true),
      ];
    }

    this.form = this.fb.group(group);

    this.publishToLXPControl = this.form.get('publishToLXP') as FormControl;
    this.lxpPrivateControl = this.form.get('lxpPrivate') as FormControl;
    this.lxpRestrictUsersControl = this.form.get('lxpRestrictUsers') as FormControl;
    this.lxpRestrictGroupsControl = this.form.get('lxpRestrictGroups') as FormControl;
    this.lxpRestrictChannelsControl = this.form.get('lxpChannels') as FormControl;
    this.lxpRestrictPublishGroupsControl = this.form.get('lxpGroups') as FormControl;

    this.fields = this.prepareGeneralInfoFields(this.preCourse);
    console.warn(this.fields, this.preCourse.specificExternalSKU);
    if (this.preCourse.specificExternalSKU) {
      this.fields = this.fields.filter((field) => field.id !== 'externalSKU');
    }

    this.materials = this.preCourse.expressCourse.existingMaterials;
    this.getLxpChannels(null);
    this.getLxpGroups(null);

    if (this.preCourse.specificExternalSKU) {
      this.publishToLXPControl.valueChanges.pipe(untilDestroyed(this)).subscribe((publishToLXP) => {
        const externalSKU = this.form.get('externalSKU');
        if (publishToLXP) {
          externalSKU.setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z0-9]+$/i),
            Validators.minLength(4),
            Validators.maxLength(8),
          ]);
          externalSKU.setAsyncValidators(this.adminCoursesService.existingSKUAsyncValidator(true));
        } else {
          externalSKU.setValue(null);
          externalSKU.clearValidators();
          externalSKU.clearAsyncValidators();
        }
        externalSKU.updateValueAndValidity();
      });
    }
  }

  onInputLxpUsers(searchValue: string): void {
    if (searchValue && searchValue.length > 2) {
      this.lxpUsers$ = this.lxpUsersService.getLxpUsers(searchValue);
    }
  }

  onInputLxpGroups(searchValue: string): void {
    if (searchValue && searchValue.length > 2) {
      this.getLxpGroups(searchValue);
    }
  }

  getLxpChannels(searchValue: string): void {
    this.lxpChannels$ = this.lxpUsersService.getLxpChannels(searchValue);
  }

  getLxpGroups(searchValue: string): void {
    this.lxpGroups$ = this.lxpUsersService.getLxpGroups(searchValue);
  }

  get lxpUsersCount(): number {
    return this.lxpRestrictUsersControl && this.lxpRestrictUsersControl.value
      ? this.lxpRestrictUsersControl.value.length
      : 0;
  }

  get lxpGroupsCount(): number {
    return this.lxpRestrictGroupsControl && this.lxpRestrictGroupsControl.value
      ? this.lxpRestrictGroupsControl.value.length
      : 0;
  }

  get lxpChannelsCount(): number {
    return this.lxpRestrictChannelsControl && this.lxpRestrictChannelsControl.value
      ? this.lxpRestrictChannelsControl.value.length
      : 0;
  }

  get lxpPublishGroupsCount(): number {
    return this.lxpRestrictPublishGroupsControl && this.lxpRestrictPublishGroupsControl.value
      ? this.lxpRestrictPublishGroupsControl.value.length
      : 0;
  }

  isSelected(selectedValue: IKeyValuePair[] = [], optionKey: string): boolean {
    if (selectedValue?.length > 0) {
      return selectedValue.some((item) => item.key === optionKey);
    }
    return false;
  }

  onRemoveUser(val, key: string): void {
    let kValue;
    let kIndex;
    switch (key) {
      case 'user':
        kValue = [...this.lxpRestrictUsersControl.value];
        kIndex = kValue.findIndex((k) => k === val);
        kValue.splice(kIndex, 1);
        this.lxpRestrictUsersControl.patchValue(kValue);
        break;
      case 'group':
        kValue = [...this.lxpRestrictGroupsControl.value];
        kIndex = kValue.findIndex((k) => k === val);
        kValue.splice(kIndex, 1);
        this.lxpRestrictGroupsControl.patchValue(kValue);
        break;
      case 'channel':
        kValue = [...this.lxpRestrictChannelsControl.value];
        kIndex = kValue.findIndex((k) => k.key === val.key);
        kValue.splice(kIndex, 1);
        this.lxpRestrictChannelsControl.patchValue(kValue);
        break;
      case 'publishGroup':
        kValue = [...this.lxpRestrictPublishGroupsControl.value];
        kIndex = kValue.findIndex((k) => k.key === val.key);
        kValue.splice(kIndex, 1);
        this.lxpRestrictPublishGroupsControl.patchValue(kValue);
        break;
    }
  }

  onBack(event: MouseEvent): void {
    this.store.dispatch(new GoToILTCourseCreationStep({ step: ILTCourseCreationStep.AGENDA }));
  }

  onSubmit(event: MouseEvent): void {
    const updatedCourse = produce(this.preCourse, (a: ILTCourse) => {
      a.expressCourse.courseAvailable = true;
      a.automaticPublishToLxp = this.publishToLXPControl.value;
      a.expressCourse.lxpPrivate = this.lxpPrivateControl.value;
      a.expressCourse.lxpRestrictUsers = this.lxpRestrictUsersControl.value;
      a.expressCourse.lxpRestrictGroups = this.lxpRestrictGroupsControl.value;
      a.expressCourse.lxpChannels = this.lxpRestrictChannelsControl.value;
      a.expressCourse.lxpGroups = this.lxpRestrictPublishGroupsControl.value;
      if (this.preCourse.specificExternalSKU) {
        a.expressCourse.externalSKU = this.form.get('externalSKU').value;
      }
    });

    this.submitting = true;
    this.store
      .dispatch(new UpdatePreILTCourse({ updatedCourse, step: ILTCourseCreationStep.SUMMARY }))
      .pipe(
        catchError((error) => {
          this.notification.error(error?.message);
          return of(null);
        }),
        finalize(() => {
          this.submitting = false;
          this.cdr.detectChanges();
        }),
        filter((res) => !!res),
        untilDestroyed(this),
      )
      .subscribe((state) => {
        const id = state.iltCourseCreate.preILTCourse.response.courseId;
        this.router.navigate(['admin', 'ilt-courses', 'details', id]);
      });
  }

  prepareGeneralInfoFields(course: PreILTCourse): GeneralInfoField[] {
    return [
      {
        id: 'type',
        title: 'Course Type',
        value: {
          content: course.format?.configValue,
        },
      },
      {
        id: 'name',
        title: 'Course Name',
        value: {
          content: course.name,
          styles: { fontSize: '20px' },
        },
      },
      {
        id: 'numberOfLearners',
        title: 'Number of learners',
        value: {
          content: `${course.expressCourse.minStudents} - ${course.expressCourse.maxSeats}`,
        },
      },
      {
        id: 'category',
        title: 'Category',
        value: {
          content: course.expressCourse.categoryName,
        },
      },
      {
        id: 'subcategory',
        title: 'Sub-category',
        value: {
          content: course.expressCourse.subcategoryName,
        },
      },
      {
        id: 'keywords',
        title: 'Keywords',
        value: {
          content: course.expressCourse.keywords?.join(','),
        },
      },
      {
        id: 'level',
        title: 'Level',
        value: {
          content: course.expressCourse.level?.configValue,
        },
      },
      {
        id: 'createdBy',
        title: 'Created By',
        value: {
          content: course.createdBy,
        },
      },
      {
        id: 'externalSKU',
        title: 'Internal Course Code / SKU',
        value: {
          content: course.expressCourse.externalSKU,
        },
      },
      {
        id: 'description',
        title: 'Course Description',
        value: {
          content: course.expressCourse.description,
          contentType: 'html',
        },
      },
      {
        id: 'objectives',
        title: 'Course Objectives',
        value: {
          content: course.expressCourse.objectives,
          contentType: 'html',
        },
      },
      {
        id: 'target-audience',
        title: 'Target Audience',
        value: {
          content: course.expressCourse.targetAudience,
          contentType: 'html',
        },
      },
    ];
  }
}
