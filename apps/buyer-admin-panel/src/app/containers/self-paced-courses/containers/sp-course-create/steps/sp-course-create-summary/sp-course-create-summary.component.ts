import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError, filter, finalize } from "rxjs/operators";
import { Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import produce from "immer";

import { GoToSPCourseCreationStep, UpdatePreSelfPacedCourse } from "../../state/sp-course-create.actions";
import {
  COURSE_PUBLISH_STATUS,
  GeneralInfoField,
  IKeyValuePair,
  ILTCourse,
  InternalRepositoryMaterial,
  PreSelfPacedCourse,
  SPCourseCreationSteps
} from "../../../../../../../../../../libs/shared/src/lib/models";
import {
  NotificationService
} from "../../../../../../../../../../libs/shared/src/lib/services/common/notification.service";
import {
  LxpUsersService
} from "../../../../../../../../../../libs/shared/src/lib/services/publishing/lxp-users.service";
import {
  AdminCoursesService
} from "../../../../../../../../../../libs/shared/src/lib/services/events/admin-courses.service";

const NO_MATERIALS_LABEL = 'This course has no materials.';

@Component({
  selector: 'leap-sp-course-create-summary',
  templateUrl: './sp-course-create-summary.component.html',
  styleUrls: ['./sp-course-create-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseCreateSummaryComponent implements OnInit {
  @Input() preSelfPacedCourse: PreSelfPacedCourse;

  submitting: boolean;
  fields: GeneralInfoField[] = [];
  materials: InternalRepositoryMaterial[] = [];
  noMaterialsLabel = NO_MATERIALS_LABEL;

  coursePublishStatus = COURSE_PUBLISH_STATUS;
  form: FormGroup;
  publishToLXPControl: FormControl;
  lxpPrivateControl: FormControl;
  lxpUsers$: Observable<IKeyValuePair[]>;
  lxpGroups$: Observable<IKeyValuePair[]>;
  lxpRestrictUsersControl: FormControl;
  lxpRestrictGroupsControl: FormControl;
  lxpRestrictChannelsControl: FormControl;
  lxpRestrictPublishGroupsControl: FormControl;
  lxpChannels$: Observable<IKeyValuePair[]>;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly adminCoursesService: AdminCoursesService,
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
    if (this.preSelfPacedCourse.specificExternalSKU) {
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

    this.fields = this.prepareGeneralInfoFields(this.preSelfPacedCourse);
    if (this.preSelfPacedCourse.specificExternalSKU) {
      this.fields = this.fields.filter((field) => field.id !== 'externalSKU');
    }

    this.materials = this.preSelfPacedCourse.expressCourse.existingMaterials;

    this.getLxpChannels(null);
    this.getLxpGroups(null);

    if (this.preSelfPacedCourse.specificExternalSKU) {
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

  onBack(): void {
    this.store.dispatch(new GoToSPCourseCreationStep({ step: SPCourseCreationSteps.DETAILS }));
  }

  onSubmit(): void {
    const updatedCourse = produce(this.preSelfPacedCourse, (a: ILTCourse) => {
      a.expressCourse.courseAvailable = true;
      a.automaticPublishToLxp = this.publishToLXPControl.value;
      a.expressCourse.lxpPrivate = this.lxpPrivateControl.value;
      a.expressCourse.lxpRestrictUsers = this.lxpRestrictUsersControl.value;
      a.expressCourse.lxpRestrictGroups = this.lxpRestrictGroupsControl.value;
      a.expressCourse.lxpChannels = this.lxpRestrictChannelsControl.value;
      a.expressCourse.lxpGroups = this.lxpRestrictPublishGroupsControl.value;
      if (this.preSelfPacedCourse.specificExternalSKU) {
        a.expressCourse.externalSKU = this.form.get('externalSKU').value;
      }
    });

    this.submitting = true;
    this.store
      .dispatch(new UpdatePreSelfPacedCourse({ updatedCourse, step: SPCourseCreationSteps.SUMMARY }))
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
      .subscribe(
        (state) => {
          const id = state.selfPacedCourseCreate.preSelfPacedCourse.response.courseId;
          this.submitting = false;
          this.router.navigate(['admin', 'self-paced-courses', 'details', id]);
        },
        () => (this.submitting = false),
      );
  }

  onInputLxpUsers(input: string): void {
    if (input && input.length > 2) {
      this.lxpUsers$ = this.lxpUsersService.getLxpUsers(input);
    }
  }

  onInputLxpGroups(input: string): void {
    if (input && input.length > 2) {
      this.getLxpGroups(input);
    }
  }

  getLxpChannels(input: string): void {
    this.lxpChannels$ = this.lxpUsersService.getLxpChannels(input);
  }

  getLxpGroups(input: string): void {
    this.lxpGroups$ = this.lxpUsersService.getLxpGroups(input);
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

  onRemoveUser(val, key: string) {
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

  prepareGeneralInfoFields(course: PreSelfPacedCourse): GeneralInfoField[] {
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
