import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
  Input,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import {
  GenerateILTCourseThumbnail,
  UpdateILTCourseAttribute,
  UploadILTCourseThumbnail,
} from '../../../state/ilt-course-details.actions';

import {
  EditLevelModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-level-modal/edit-level-modal.component";
import {
  CertificateInfo,
  CourseCategory,
  EnrollmentPolicyKeys, GeneralInfoField, IKeyValuePair,
  PublishedILTCourse, S3BucketData
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import {
  EditCourseNameModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-course-name-modal/edit-course-name-modal.component";
import {DEFAULT_QUILL_EDITOR_CONFIG} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {
  EditExternalSKUModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-external-sku-modal/edit-external-sku-modal.component";
import {
  CourseCategoryAndSubcategoryHandlerService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/course-category-and-subcategory-handler.service";
import {DownloadSphinxService} from "../../../../../../../../../../../libs/shared/src/lib/services/common";
import {
  CourseThumbnailHandlerService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/course-thumbnail-handler.service";
import {IGlobalStateModel} from "../../../../../../../state/state.model";
import {
  CertificatePreviewComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/feature/certificate-preview/certificate-preview.component";
import {LmsCategoriesService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services";
import {
  KeywordsInputModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/keywords-input-modal/keywords-input-modal.component";
import {
  EditCourseCertificateComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/feature/edit-course-certificate/edit-course-certificate.component";
import {
  QuillInputModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/quill-input-modal/quill-input-modal.component";
import {
  EditEnrollPolicyModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-enroll-policy-modal/edit-enroll-policy-modal.component";


@Component({
  selector: 'leap-ilt-course-general-details',
  templateUrl: './ilt-course-general-details.component.html',
  styleUrls: ['./ilt-course-general-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseGeneralDetailsComponent implements OnInit, OnChanges {
  @Input() iltCourse: PublishedILTCourse;

  @Select((state: IGlobalStateModel) => state.core.courseLevelDictionary)
  courseLevelDictionary$: Observable<IKeyValuePair[]>;

  categoryDictionary: CourseCategory[];
  courseLevelDictionary: IKeyValuePair[];
  enrollmentPolicyKeys = EnrollmentPolicyKeys;

  fields: GeneralInfoField[];

  constructor(
    private readonly modalService: NzModalService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly lmsCategoriesService: LmsCategoriesService,
    private readonly downloadSphinxService: DownloadSphinxService,
    private readonly courseThumbnailHandlerService: CourseThumbnailHandlerService,
    private readonly courseCategoryAndSubcategoryHandlerService: CourseCategoryAndSubcategoryHandlerService,
    private readonly messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.fields = this.prepareGeneralInfoFields(this.iltCourse);

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.iltCourse && changes.iltCourse.currentValue) {
      this.fields = this.prepareGeneralInfoFields(changes.iltCourse.currentValue);
    }
  }

  onEdit(fieldId: string): void {
    switch (fieldId) {
      case 'name':
        this.editCourseName(fieldId, this.iltCourse);
        break;

      case 'description':
        this.editQuillInput(
          fieldId,
          this.iltCourse,
          {
            mainLabel: 'Course Description',
            subLabel:
              "This will be visible to all potential buyers as the 'about' section on your product page on the Leapest storefront.",
            required: true,
            modalInitVal: this.iltCourse.description,
            modalTitle: 'Edit Course Description',
          },
          fieldId,
          true,
        );
        break;

      case 'objectives':
        this.editQuillInput(
          fieldId,
          this.iltCourse,
          {
            mainLabel: 'Course Objectives',
            subLabel: 'Please provide a general description for your course objectives',
            required: false,
            modalInitVal: this.iltCourse.objectives,
            modalTitle: 'Edit Course Objectives',
          },
          fieldId,
          true,
        );
        break;

      case 'target-audience':
        this.editQuillInput(
          fieldId,
          this.iltCourse,
          {
            mainLabel: 'Target Audience',
            subLabel: 'Please provide a general description for your target audience',
            required: false,
            modalInitVal: this.iltCourse.targetAudience,
            modalTitle: 'Edit Target Audience',
          },
          'targetAudience',
          true,
        );
        break;

      case 'category':
      case 'subcategory':
        this.editCategory(this.iltCourse);
        break;

      case 'keywords':
        this.editKeywords(fieldId, this.iltCourse);
        break;

      case 'level':
        this.editLevel(fieldId, this.iltCourse);
        break;

      case 'external-sku':
        this.editExternalSKU(fieldId, this.iltCourse);
        break;

      case 'enrollment-policy':
        this.editEnrollmentPolicy(fieldId, this.iltCourse);
        break;

      case 'certificate-template':
        this.editCertificate(fieldId, this.iltCourse);
        break;

      default:
        throw new Error('Wrong field id');
    }
  }

  private editEnrollmentPolicy(attribute: string, course: PublishedILTCourse): void {
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
              .dispatch(new UpdateILTCourseAttribute({ updatedCourse, attribute, props: ['enrollmentPolicy'] }))
              .toPromise()
              .then((_) => {
                this.messageService.success(
                  formValue.enrollmentPolicy === this.enrollmentPolicyKeys.SINGLE
                    ? 'Changes Saved! Learners can now enrol to only one Event from this Course!'
                    : 'Changes Saved! Learners can now enrol to multiple Events from this Course!',
                );
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  private editCourseName(attribute: string, course: PublishedILTCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Course Name',
      nzContent: EditCourseNameModalComponent,
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
              .dispatch(new UpdateILTCourseAttribute({ updatedCourse, attribute }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editQuillInput(
    attribute: string,
    course: PublishedILTCourse,
    modalConfig: {
      mainLabel: string;
      subLabel: string;
      required: boolean;
      modalInitVal: string;
      modalTitle: string;
    },
    propertyName: string,
    propagateAttributes: boolean,
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
            const updatedCourse = {
              ...course,
              [propertyName]: formValue.quillInput,
              propagateAttributes: formValue.propagateAttributes,
            };

            return this.store
              .dispatch(new UpdateILTCourseAttribute({ updatedCourse, attribute, props: [propertyName] }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editCategory(course: PublishedILTCourse): void {
    this.courseCategoryAndSubcategoryHandlerService.editCategory<PublishedILTCourse, UpdateILTCourseAttribute>(
      course,
      this.categoryDictionary,
      (updatedCourse: PublishedILTCourse) => {
        return this.store.dispatch(
          new UpdateILTCourseAttribute({
            updatedCourse,
            attribute: 'category',
            props: CourseCategoryAndSubcategoryHandlerService.editableProps,
          }),
        );
      },
    );
  }

  private editKeywords(attribute: string, course: PublishedILTCourse): void {
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
              .dispatch(new UpdateILTCourseAttribute({ updatedCourse, attribute }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editLevel(attribute: string, course: PublishedILTCourse): void {
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
              .dispatch(new UpdateILTCourseAttribute({ updatedCourse, attribute }))
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editExternalSKU(attribute: string, course: PublishedILTCourse): void {
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
                new UpdateILTCourseAttribute({
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

  private editCertificate(attribute: string, course: PublishedILTCourse): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Participation Certificate',
      nzContent: EditCourseCertificateComponent,
      nzComponentParams: {
        currentCertificate: this.iltCourse.participationCertificate,
        isCourse: true,
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
            const certificateId = data.form.getRawValue().certificate;
            const updatedCourse = {
              ...course,
              participationCertificate: { id: certificateId },
            };

            return this.store
              .dispatch(
                new UpdateILTCourseAttribute({
                  updatedCourse,
                  attribute,
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  public downloadCertificate(certificate: CertificateInfo): void {
    const link = this.downloadSphinxService.getSphinxUrl(certificate.s3Bucket, certificate.s3Key);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  public previewCertificate(certificate: CertificateInfo): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Template Preview',
      nzContent: CertificatePreviewComponent,
      nzComponentParams: {
        s3Bucket: certificate.s3Bucket,
        s3Key: certificate.s3Key,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 900,
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Download',
          type: 'primary',
          onClick: () => this.downloadCertificate(certificate),
        },
      ],
    });
  }

  public deleteCertificate(): void {
    const updatedCourse = {
      ...this.iltCourse,
      participationCertificate: null,
    };
    const description = `You are about to delete the participation certificate from this Course.
     Please note that these changes will only be applied to newly scheduled events.
      Any active course events that you might have will still have this certificate associated. How do you wish to proceed?`;

    this.modalService.confirm({
      nzTitle: 'Delete Certificate from Course?',
      nzContent: description,
      nzClassName: 'delete-certificate-modal',
      nzWidth: '660px',
      nzOkText: 'Delete Certificate',
      nzOkDanger: true,
      nzIconType: null,
      nzOnOk: async () =>
        this.store
          .dispatch(new UpdateILTCourseAttribute({ updatedCourse, attribute: 'certificate-template' }))
          .toPromise(),
      nzCancelText: 'Cancel',
    });
  }

  onGenerateThumbnail(courseId: string): void {
    this.courseThumbnailHandlerService.generateThumbnail(() => {
      return this.store.dispatch(new GenerateILTCourseThumbnail({ courseId }));
    });
  }

  onUploadThumbnail(thumbnailUrl: string, courseId: string): void {
    this.courseThumbnailHandlerService.uploadThumbnail(thumbnailUrl, (s3BucketData: S3BucketData) => {
      return this.store.dispatch(new UploadILTCourseThumbnail({ courseId, s3BucketData }));
    });
  }

  private prepareGeneralInfoFields(course: PublishedILTCourse): GeneralInfoField[] {
    return [
      {
        id: 'type',
        title: 'Course Type',
        value: {
          content: course.format?.configValue,
        },
        editable: false,
      },
      {
        id: 'name',
        title: 'Course Name',
        value: {
          content: course.name,
          styles: { fontSize: '20px' },
        },
        editable: true,
      },
      {
        id: 'numberOfLearners',
        title: 'Number of learners',
        value: {
          content: `${course.minStudents} - ${course.maxSeats}`,
        },
        editable: false,
      },
      {
        id: 'category',
        title: 'Category',
        value: {
          content: course.categoryName,
        },
        editable: true,
      },
      {
        id: 'subcategory',
        title: 'Sub-category',
        value: {
          content: course.subcategoryName,
        },
        editable: true,
      },
      {
        id: 'keywords',
        title: 'Keywords',
        value: {
          content: course.keywords?.join(','),
        },
        editable: true,
      },
      {
        id: 'level',
        title: 'Level',
        value: {
          content: course.level?.configValue,
        },
        editable: true,
      },
      {
        id: 'createdBy',
        title: 'Created By',
        value: {
          content: course.createdBy,
        },
        editable: false,
      },
      {
        id: 'external-sku',
        title: course.specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
        value: {
          content: course.externalSKU,
        },
        editable: true,
      },
      {
        id: 'description',
        title: 'Course Description',
        value: {
          content: course.description,
          contentType: 'html',
        },
        editable: true,
      },
      {
        id: 'objectives',
        title: 'Course Objectives',
        value: {
          content: course.objectives,
          contentType: 'html',
        },
        editable: true,
      },
      {
        id: 'target-audience',
        title: 'Target Audience',
        value: {
          content: course.targetAudience,
          contentType: 'html',
        },
        editable: true,
      },
      {
        id: 'enrollment-policy',
        title: 'Enrollment Policy',
        value: {
          content:
            course.enrollmentPolicy?.configKey === this.enrollmentPolicyKeys.SINGLE
              ? 'Learners can only enroll to one event'
              : 'Learners can enroll in more than one event',
        },
        editable: true,
      },
      {
        id: 'certificate-template',
        title: 'PARTICIPATION CERTIFICATE',
        value: {
          contentType: 'certificate',
          content: {
            value: course?.participationCertificate?.fileName || null,
            s3Bucket: course?.participationCertificate?.s3Bucket || null,
            s3Key: course?.participationCertificate?.s3Key || null,
            delete: true,
            preview: true,
            enabled: true,
          },
        },
        editable: true,
      },
    ];
  }
}
