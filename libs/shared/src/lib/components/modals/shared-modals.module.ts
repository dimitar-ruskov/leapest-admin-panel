import { NgModule } from '@angular/core';
import {AddAddressModalModule} from "./add-address-modal/add-address-modal.module";
import {AddCourseMaterialModalModule} from "./add-course-material-modal/add-course-material-modal.module";
import {AssignUsersModalModule} from "./assign-users-modal/assign-users-modal.module";
import {BasicUserModalModule} from "./basic-user-modal/basic-user-modal.module";
import {
  BulkAttendanceTrackingSelectionModalModule
} from "./bulk-attendance-tracking-selection-modal/bulk-attendance-tracking-selection-modal.module";
import {CancelEventConfirmModalModule} from "./cancel-event-confirm-modal/cancel-event-confirm-modal.module";
import {CreateCategoryModalModule} from "./create-category-modal/create-category-modal.module";
import {CreateNewCourseModalModule} from "./create-new-course-modal/create-new-course-modal.module";
import {CreateSubCategoryModalModule} from "./create-sub-category-modal/create-sub-category-modal.module";
import {CreationLoaderModalModule} from "./creation-loader-modal/creation-loader-modal.module";
import {DangerActionModalModule} from "./danger-action-modal/danger-action-modal.module";
import {DeleteCourseConfirmModalModule} from "./delete-course-confirm-modal/delete-course-confirm-modal.module";
import {EditAddressModalModule} from "./edit-address-modal/edit-address-modal.module";
import {
  EditAttendanceTrackingSettingsModalModule
} from "./edit-attendance-tracking-settings-modal/edit-attendance-tracking-settings-modal.module";
import {EditCategoryModalModule} from "./edit-category-modal/edit-category-modal.module";
import {EditConferenceLinkModalModule} from "./edit-conference-link-modal/edit-conference-link-modal.module";
import {EditCourseCompletionModalModule} from "./edit-course-completion-modal/edit-course-completion-modal.module";
import {EditCourseNameModalModule} from "./edit-course-name-modal/edit-course-name-modal.module";
import {EditEnrollPolicyModalModule} from "./edit-enroll-policy-modal/edit-enroll-policy-modal.module";
import {EditExternalSkuModalModule} from "./edit-external-sku-modal/edit-external-sku-modal.module";
import {EditInstructorsModalModule} from "./edit-instructors-modal/edit-instructors-modal.module";
import {EditInternalRepoNameModalModule} from "./edit-internal-repo-name-modal/edit-internal-repo-name-modal.module";
import {EditLanguageModalModule} from "./edit-language-modal/edit-language-modal.module";
import {EditNumberOfLearnersModalModule} from "./edit-number-of-learners-modal/edit-number-of-learners-modal.module";
import {EditPassRateModalModule} from "./edit-pass-rate-modal/edit-pass-rate-modal.module";
import {EditSelfRegistrationModalModule} from "./edit-self-registration-modal/edit-self-registration-modal.module";
import {EditTimezoneModalModule} from "./edit-timezone-modal/edit-timezone-modal.module";
import {EditTrainingManagerModalModule} from "./edit-training-manager-modal/edit-training-manager-modal.module";
import {EditVirtualMeetingsModalModule} from "./edit-virtual-meetings-modal/edit-virtual-meetings-modal.module";
import {EditWaitingListModalModule} from "./edit-waiting-list-modal/edit-waiting-list-modal.module";
import {EventCreateModalModule} from "./event-create-modal/event-create-modal.module";
import {GenerateThumbnailModalModule} from "./generate-thumbnail-modal/generate-thumbnail-modal.module";
import {KeywordsInputModalModule} from "./keywords-input-modal/keywords-input-modal.module";
import {
  MaterialsTrackingDetailsModalModule
} from "./materials-tracking-details-modal/materials-tracking-details-modal.module";
import {NotificationChangeModalModule} from "./notification-change-modal/notification-change-modal.module";
import {NotificationLogoModalModule} from "./notification-logo-modal/notification-logo-modal.module";
import {NotificationPreviewModalModule} from "./notification-preview-modal/notification-preview-modal.module";
import {PublishToLxpModalModule} from "./publish-to-lxp-modal/publish-to-lxp-modal.module";
import {QuillInputModalModule} from "./quill-input-modal/quill-input-modal.module";
import {RemoveWaitingListModalModule} from "./remove-waiting-list-modal/remove-waiting-list-modal.module";
import {SelectCategoryModalModule} from "./select-category-modal/select-category-modal.module";
import {SelectInputModalModule} from "./select-input-modal/select-input-modal.module";
import {SelectSubCategoryModalModule} from "./select-sub-category-modal/select-sub-category-modal.module";
import {TextInputModalModule} from "./text-input-modal/text-input-modal.module";
import {UploadThumbnailModalModule} from "./upload-thumbnail-modal/upload-thumbnail-modal.module";
import {VariantSelectModalModule} from "./variant-select-modal/variant-select-modal.module";

const modals = [
  AddAddressModalModule,
  AddCourseMaterialModalModule,
  AssignUsersModalModule,
  BasicUserModalModule,
  BulkAttendanceTrackingSelectionModalModule,
  CancelEventConfirmModalModule,
  CreateCategoryModalModule,
  CreateNewCourseModalModule,
  CreateSubCategoryModalModule,
  CreationLoaderModalModule,
  DangerActionModalModule,
  DeleteCourseConfirmModalModule,
  EditAddressModalModule,
  EditAttendanceTrackingSettingsModalModule,
  EditCategoryModalModule,
  EditConferenceLinkModalModule,
  EditCourseCompletionModalModule,
  EditCourseNameModalModule,
  EditEnrollPolicyModalModule,
  EditExternalSkuModalModule,
  EditInstructorsModalModule,
  EditInternalRepoNameModalModule,
  EditLanguageModalModule,
  EditNumberOfLearnersModalModule,
  EditPassRateModalModule,
  EditSelfRegistrationModalModule,
  EditTimezoneModalModule,
  EditTrainingManagerModalModule,
  EditVirtualMeetingsModalModule,
  EditWaitingListModalModule,
  EventCreateModalModule,
  GenerateThumbnailModalModule,
  KeywordsInputModalModule,
  MaterialsTrackingDetailsModalModule,
  NotificationChangeModalModule,
  NotificationLogoModalModule,
  NotificationPreviewModalModule,
  PublishToLxpModalModule,
  QuillInputModalModule,
  RemoveWaitingListModalModule,
  SelectCategoryModalModule,
  SelectInputModalModule,
  SelectSubCategoryModalModule,
  TextInputModalModule,
  UploadThumbnailModalModule,
  VariantSelectModalModule
];

@NgModule({
  imports: modals,
  exports: modals
})
export class SharedModalsModule {}
