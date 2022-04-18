import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { NzMessageService } from "ng-zorro-antd/message";
import { untilDestroyed } from "@ngneat/until-destroy";
import {
  GenerateSelfPacedCourseThumbnail,
  UpdateSPCourseAttribute,
  UploadSelfPacedCourseThumbnail
} from "../../../state/sp-course-details.actions";
import {
  TextInputModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/text-input-modal/text-input-modal.component";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import {
  EditLevelModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-level-modal/edit-level-modal.component";
import {
  ActiveSelfPacedCourse,
  CourseCategory,
  DEFAULT_QUILL_EDITOR_CONFIG,
  EnrollmentPolicyKeys,
  GeneralInfoField,
  IKeyValuePair,
  S3BucketData
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import {
  EditExternalSKUModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-external-sku-modal/edit-external-sku-modal.component";
import {
  CourseCategoryAndSubcategoryHandlerService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/course-category-and-subcategory-handler.service";
import {
  CourseThumbnailHandlerService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/course-thumbnail-handler.service";
import { IGlobalStateModel } from "../../../../../../../state/state.model";
import {
  KeywordsInputModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/keywords-input-modal/keywords-input-modal.component";
import {
  QuillInputModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/quill-input-modal/quill-input-modal.component";
import {
  EditEnrollPolicyModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-enroll-policy-modal/edit-enroll-policy-modal.component";
import {
  LmsCategoriesService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/lms-categories.service";

@Component({
  selector: 'leap-sp-course-general-details',
  templateUrl: './sp-course-general-details.component.html',
  styleUrls: ['./sp-course-general-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCourseGeneralDetailsComponent implements OnInit {
  @Input() selfPacedCourse: ActiveSelfPacedCourse;

  @Select((state: IGlobalStateModel) => state.core.courseLevelDictionary)
  courseLevelDictionary$: Observable<IKeyValuePair[]>;

  courseLevelDictionary: IKeyValuePair[];
  categoryDictionary: CourseCategory[];
  enrollmentPolicyKeys = EnrollmentPolicyKeys;

  fields: GeneralInfoField[];

  constructor(
    private readonly modalService: NzModalService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly lmsCategoriesService: LmsCategoriesService,
    private readonly courseThumbnailHandlerService: CourseThumbnailHandlerService,
    private readonly courseCategoryAndSubcategoryHandlerService: CourseCategoryAndSubcategoryHandlerService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.fields = this.prepareGeneralInfoFields(this.selfPacedCourse);

    this.courseLevelDictionary$.pipe(untilDestroyed(this)).subscribe((response: IKeyValuePair[]) => {
      this.courseLevelDictionary = response;
    });

    this.lmsCategoriesService
      .getLMSCategories()
      .pipe(untilDestroyed(this))
      .subscribe((resource) => {
        if (resource.isSuccess) {
          this.categoryDictionary = resource.response;
        }
      });
  }

  onEdit(fieldId: string): void {
    switch (fieldId) {
      case 'name':
        this.editCourseName(fieldId, this.selfPacedCourse);
        break;

      case 'description':
        this.editQuillInput(
          fieldId,
          this.selfPacedCourse,
          {
            mainLabel: 'Course Description',
            subLabel:
              "This will be visible to all potential buyers as the 'about' section on your product page on the Leapest storefront.",
            required: true,
            modalInitVal: this.selfPacedCourse.description,
            modalTitle: 'Edit Course Description',
          },
          fieldId,
        );
        break;

      case 'objectives':
        this.editQuillInput(
          fieldId,
          this.selfPacedCourse,
          {
            mainLabel: 'Course Objectives',
            subLabel: 'Please provide a general description for your course objectives',
            required: false,
            modalInitVal: this.selfPacedCourse.objectives,
            modalTitle: 'Edit Course Objectives',
          },
          fieldId,
        );
        break;

      case 'target-audience':
        this.editQuillInput(
          fieldId,
          this.selfPacedCourse,
          {
            mainLabel: 'Target Audience',
            subLabel: 'Please provide a general description for your target audience',
            required: false,
            modalInitVal: this.selfPacedCourse.targetAudience,
            modalTitle: 'Edit Target Audience',
          },
          'targetAudience',
        );
        break;

      case 'category':
      case 'subcategory':
        this.editCategory(this.selfPacedCourse);
        break;

      case 'keywords':
        this.editKeywords(fieldId, this.selfPacedCourse);
        break;

      case 'level':
        this.editLevel(fieldId, this.selfPacedCourse);
        break;

      case 'enrollment-policy':
        this.editEnrollmentPolicy(fieldId, this.selfPacedCourse);
        break;

      case 'external-sku':
        this.editExternalSKU(fieldId, this.selfPacedCourse);
        break;

      default:
        throw new Error('Wrong field id');
    }
  }

  private editEnrollmentPolicy(attribute: string, course: ActiveSelfPacedCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Enrollment Policy',
      nzContent: EditEnrollPolicyModalComponent,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (data) => !data.form.valid || data.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedCourse = {
              ...course,
              enrollmentPolicy: {
                configKey: formValue.enrollmentPolicy,
              },
            };

            return this.store
              .dispatch(new UpdateSPCourseAttribute({ updatedCourse, attribute, props: ['enrollmentPolicy'] }))
              .toPromise()
              .then((_) => {
                this.messageService.success(
                  formValue.enrollmentPolicy === this.enrollmentPolicyKeys.SINGLE
                    ? 'Changes Saved! Learners can now enrol to only one Language Variant from this Course!'
                    : 'Changes Saved! Learners can now enrol to multiple Language Variants from this Course!',
                );
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  private editCourseName(attribute: string, course: ActiveSelfPacedCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Course Name',
      nzContent: TextInputModalComponent,
      nzComponentParams: {
        mainLabel: 'Course Name',
        subLabel: `This will be the official name of your course as it will be displayed towards learners.
                   The name should be between 6 and 80 characters.`,
        minLength: 6,
        initVal: course.name,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedCourse = { ...course, name: formValue.textInput };

            return this.store
              .dispatch(new UpdateSPCourseAttribute({ updatedCourse, attribute }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editQuillInput(
    attribute: string,
    course: ActiveSelfPacedCourse,
    modalConfig: {
      mainLabel: string;
      subLabel: string;
      required: boolean;
      modalInitVal: string;
      modalTitle: string;
    },
    propertyName: string,
  ) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: modalConfig.modalTitle,
      nzContent: QuillInputModalComponent,
      nzComponentParams: {
        mainLabel: modalConfig.mainLabel,
        subLabel: modalConfig.subLabel,
        initVal: modalConfig.modalInitVal,
        quillConfig: DEFAULT_QUILL_EDITOR_CONFIG,
        required: modalConfig.required,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedCourse = { ...course, [propertyName]: formValue.quillInput };

            return this.store
              .dispatch(new UpdateSPCourseAttribute({ updatedCourse, attribute, props: [propertyName] }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editCategory(course: ActiveSelfPacedCourse): void {
    this.courseCategoryAndSubcategoryHandlerService.editCategory<ActiveSelfPacedCourse, UpdateSPCourseAttribute>(
      course,
      this.categoryDictionary,
      (updatedCourse: ActiveSelfPacedCourse) => {
        return this.store.dispatch(
          new UpdateSPCourseAttribute({
            updatedCourse,
            attribute: 'category',
            props: CourseCategoryAndSubcategoryHandlerService.editableProps,
          }),
        );
      },
    );
  }

  private editKeywords(attribute: string, course: ActiveSelfPacedCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Keywords',
      nzContent: KeywordsInputModalComponent,
      nzComponentParams: {
        mainLabel: 'Keywords',
        subLabel:
          'Keywords allow your product to be more easily discovered.\n' +
          'Start typing the keywords that help to define your product and select from the suggestions provided. ' +
          "If you made a mistake, click the 'x' icon and retype the keyword.",
        initVal: course.level.id,
        keywords: course.keywords,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedCourse = { ...course, keywords: formValue.keywords };

            return this.store
              .dispatch(new UpdateSPCourseAttribute({ updatedCourse, attribute }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editLevel(attribute: string, course: ActiveSelfPacedCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Course Level',
      nzContent: EditLevelModalComponent,
      nzComponentParams: {
        mainLabel: 'Course Level',
        subLabel: 'Edit the level of your course',
        initVal: course.level.id,
        options: this.courseLevelDictionary,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedCourse = { ...course, level: { ...course.level, id: formValue.levelId } };

            return this.store
              .dispatch(new UpdateSPCourseAttribute({ updatedCourse, attribute }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editExternalSKU(attribute: string, course: ActiveSelfPacedCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: course.specificExternalSKU ? 'Edit Custom Course Code' : 'Edit Internal Course Code / SKU',
      nzContent: EditExternalSKUModalComponent,
      nzComponentParams: {
        mainLabel: course.specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
        subLabel: course.specificExternalSKU
          ? 'Please enter a code between 4 to 8 characters containing only digits and alphabets in upper case.'
          : 'Edit the Internal Course Code / SKU',
        initVal: course.externalSKU,
        pattern: course.specificExternalSKU ? /^[A-Z0-9]+$/i : undefined,
        minLength: course.specificExternalSKU ? 4 : undefined,
        maxLength: course.specificExternalSKU ? 8 : undefined,
        specificExternalSKU: course.specificExternalSKU,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedCourse = { ...course, externalSKU: formValue.externalSKU || null };

            return this.store
              .dispatch(
                new UpdateSPCourseAttribute({
                  updatedCourse,
                  attribute: 'external-sku',
                  props: ['externalSKU'],
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  onGenerateThumbnail(courseId: string): void {
    this.courseThumbnailHandlerService.generateThumbnail(() => {
      return this.store.dispatch(new GenerateSelfPacedCourseThumbnail({ courseId }));
    });
  }

  onUploadThumbnail(thumbnailUrl: string, courseId: string): void {
    this.courseThumbnailHandlerService.uploadThumbnail(thumbnailUrl, (s3BucketData: S3BucketData) => {
      return this.store.dispatch(new UploadSelfPacedCourseThumbnail({ courseId, s3BucketData }));
    });
  }

  private prepareGeneralInfoFields(selfPacedCourse: ActiveSelfPacedCourse): GeneralInfoField[] {
    return [
      {
        id: 'type',
        title: 'Course Type',
        value: {
          content: 'Self-paced course',
        },
        editable: false,
      },
      {
        id: 'name',
        title: 'Course Name',
        value: {
          content: selfPacedCourse.name,
          styles: { fontSize: '20px' },
        },
        editable: true,
      },
      {
        id: 'courseRegistrationApproval',
        title: 'Registration Approval',
        value: {
          content: `Approval is ${
            selfPacedCourse.registrationApprovalRequired ? 'not' : ''
          } required when learners sign up`,
        },
        editable: false,
      },
      {
        id: 'category',
        title: 'Category',
        value: {
          content: selfPacedCourse.categoryName,
        },
        editable: true,
      },
      {
        id: 'subcategory',
        title: 'Sub-category',
        value: {
          content: selfPacedCourse.subcategoryName,
        },
        editable: true,
      },
      {
        id: 'keywords',
        title: 'Keywords',
        value: {
          content: selfPacedCourse.keywords?.join(','),
        },
        editable: true,
      },
      {
        id: 'level',
        title: 'Level',
        value: {
          content: selfPacedCourse.level?.configValue,
        },
        editable: true,
      },
      {
        id: 'createdBy',
        title: 'Created By',
        value: {
          content: selfPacedCourse.createdBy,
        },
        editable: false,
      },
      {
        id: 'external-sku',
        title: selfPacedCourse.specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
        value: {
          content: selfPacedCourse.externalSKU,
        },
        editable: true,
      },
      {
        id: 'description',
        title: 'Course Description',
        value: {
          content: selfPacedCourse.description,
          contentType: 'html',
        },
        editable: true,
      },
      {
        id: 'objectives',
        title: 'Course Objectives',
        value: {
          content: selfPacedCourse.objectives,
          contentType: 'html',
        },
        editable: true,
      },
      {
        id: 'target-audience',
        title: 'Target Audience',
        value: {
          content: selfPacedCourse.targetAudience,
          contentType: 'html',
        },
        editable: true,
      },
      {
        id: 'enrollment-policy',
        title: 'Enrollment Policy',
        value: {
          content:
            selfPacedCourse.enrollmentPolicy?.configKey === this.enrollmentPolicyKeys.SINGLE
              ? 'Learners can only enroll to one event'
              : 'Learners can enroll in more than one event',
        },
        editable: true,
      },
      {
        id: 'privacy-settings',
        title: 'Privacy Settings',
        value: {
          content:
            selfPacedCourse.lxpPrivate === true ? 'Private' : selfPacedCourse.lxpPrivate === false ? 'Public' : 'N/A',
          description:
            'The Smartcard corresponding to this course is only visible to users and groups listed in the RESTRICTED TO sections.',
          styles: { fontSize: '14px' },
        },
        editable: false,
      },
      {
        id: 'restricted-users',
        title: 'Restricted to (users)',
        value: {
          content: selfPacedCourse.lxpRestrictUsers?.length
            ? selfPacedCourse.lxpRestrictUsers.map((item) => item).join(', ')
            : 'N/A',
          contentType: 'html',
        },
        editable: false,
      },
      {
        id: 'restricted-groups',
        title: 'Restricted to (groups)',
        value: {
          content: selfPacedCourse.lxpRestrictGroups?.length
            ? selfPacedCourse.lxpRestrictGroups.map((item) => item.value).join(', ')
            : 'N/A',
          contentType: 'html',
        },
        editable: false,
      },
    ];
  }
}
