import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzUploadModule} from "ng-zorro-antd/upload";

import {IltCourseDetailsRoutingModule} from "./ilt-course-details-routing.module";
import { IltCourseDetailsState } from './state/ilt-course-details.state';
import { IltCourseDetailsComponent } from './ilt-course-details.component';
import { IltCourseGeneralInfoComponent } from './containers/ilt-course-general-info/ilt-course-general-info.component';
import { IltCourseMaterialsComponent } from './containers/ilt-course-materials/ilt-course-materials.component';
import { IltCourseEventsTabComponent } from './containers/ilt-course-events-tab/ilt-course-events-tab.component';
import { IltCourseReviewsComponent } from './containers/ilt-course-reviews/ilt-course-reviews.component';
import { IltCourseReviewsState } from './containers/ilt-course-reviews/state/ilt-course-reviews.state';
import { IltCourseNotificationsComponent } from './containers/ilt-course-notifications/ilt-course-notifications.component';
import { IltCourseNotificationDetailsComponent } from './containers/ilt-course-notifications/ilt-course-notification-details/ilt-course-notification-details.component';
import { IltCourseDetailsNotificationsState } from './containers/ilt-course-notifications/state/ilt-course-details-notifications.state';
import { IltCourseEventsBulkComponent } from './containers/ilt-course-events-tab/ilt-course-events-bulk/ilt-course-events-bulk.component';
import { IltCourseEventsFinishedComponent } from './containers/ilt-course-events-tab/ilt-course-events-finished/ilt-course-events-finished.component';
import { IltCourseEventsDraftComponent } from './containers/ilt-course-events-tab/ilt-course-events-draft/ilt-course-events-draft.component';
import { IltCourseEventsActiveComponent } from './containers/ilt-course-events-tab/ilt-course-events-active/ilt-course-events-active.component';
import { IltCourseEventsCommonState } from './containers/ilt-course-events-tab/state/ilt-course-events-common.state';
import { IltCourseEventsBulkUploadsState } from './containers/ilt-course-events-tab/ilt-course-events-bulk/state/ilt-course-events-bulk.state';
import {
  BulkUploadSchedulingReportListComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/components/ilt-course-events-bulk-upload-details/bulk-upload-scheduling-report/bulk-upload-scheduling-report-list/bulk-upload-scheduling-report-list.component";
import {
  IltCourseEventsBulkUploadDetailsComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/components/ilt-course-events-bulk-upload-details/ilt-course-events-bulk-upload-details.component";
import {
  BulkUploadValidationReportIssuesModalComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/components/ilt-course-events-bulk-upload-details/bulk-upload-validation-report/bulk-upload-validation-report-issues-modal/bulk-upload-validation-report-issues-modal.component";
import {
  BulkUploadSchedulingReportComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/components/ilt-course-events-bulk-upload-details/bulk-upload-scheduling-report/bulk-upload-scheduling-report.component";
import {
  BulkUploadValidationReportComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/components/ilt-course-events-bulk-upload-details/bulk-upload-validation-report/bulk-upload-validation-report.component";
import {
  BulkUploadModalComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/components/bulk-upload-modal/bulk-upload-modal.component";
import {
  MasterInternalRepoTileModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/master-internal-repo-tile/master-internal-repo-tile.module";
import {
  FormLabelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  GeneralInfoModule
} from "../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {
  NoMaterialsModule
} from "../../../../../../../../libs/shared/src/lib/components/common/no-materials/no-materials.module";
import {TAgendaModule} from "../../../../../../../../libs/shared/src/lib/components/feature/t-agenda/t-agenda.module";
import {
  CertificatePreviewModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/certificate-preview/certificate-preview.module";
import {
  TableControlPanelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  TableGridModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableSearchModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {
  CtaContainerModule
} from "../../../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  CertificateViewModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/certificate-view/certificate-view.module";
import {
  CourseMaterialsInputModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/course-materials-input/course-materials-input.module";
import {
  NotificationFilterPillsModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/notification-filter-pills/notification-filter-pills.module";
import {
  FilterDropdownModule
} from "../../../../../../../../libs/shared/src/lib/components/common/filter-dropdown/filter-dropdown.module";
import {
  UploadThumbnailModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/upload-thumbnail-modal/upload-thumbnail-modal.module";
import {
  PublishToLxpModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/publish-to-lxp-modal/publish-to-lxp-modal.module";
import {
  KeywordsInputModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/keywords-input-modal/keywords-input-modal.module";
import {
  EventCreateModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/event-create-modal/event-create-modal.module";
import {
  EditLevelModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-level-modal/edit-level-modal.module";
import {
  EditExternalSkuModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-external-sku-modal/edit-external-sku-modal.module";
import {
  EditEnrollPolicyModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-enroll-policy-modal/edit-enroll-policy-modal.module";
import {
  EditCourseNameModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-course-name-modal/edit-course-name-modal.module";
import {
  EditCategoryModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-category-modal/edit-category-modal.module";
import {
  DeleteCourseConfirmModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/delete-course-confirm-modal/delete-course-confirm-modal.module";
import {
  CreateSubCategoryModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/create-sub-category-modal/create-sub-category-modal.module";
import {
  CreateCategoryModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/create-category-modal/create-category-modal.module";
import {
  CancelEventConfirmModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/cancel-event-confirm-modal/cancel-event-confirm-modal.module";


@NgModule({
  declarations: [
    IltCourseDetailsComponent,
    IltCourseGeneralInfoComponent,
    IltCourseMaterialsComponent,
    IltCourseEventsTabComponent,
    IltCourseReviewsComponent,
    IltCourseNotificationsComponent,
    IltCourseNotificationDetailsComponent,
    IltCourseReviewsComponent,
    IltCourseEventsBulkComponent,
    BulkUploadModalComponent,
    IltCourseEventsBulkUploadDetailsComponent,
    BulkUploadValidationReportComponent,
    BulkUploadSchedulingReportComponent,
    BulkUploadSchedulingReportListComponent,
    IltCourseEventsActiveComponent,
    IltCourseEventsFinishedComponent,
    IltCourseEventsDraftComponent,
    BulkUploadValidationReportIssuesModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IltCourseDetailsRoutingModule,

    NgxsFormPluginModule,
    NgxsModule.forFeature([
      IltCourseDetailsState,
      IltCourseReviewsState,
      IltCourseDetailsNotificationsState,
      IltCourseEventsCommonState,
      IltCourseEventsBulkUploadsState,
    ]),
    MasterInternalRepoTileModule,
    CtaContainerModule,
    GeneralInfoModule,
    FormLabelModule,
    TableControlPanelModule,
    TableSearchModule,
    TableGridModule,
    TAgendaModule,
    NoMaterialsModule,
    CourseMaterialsInputModule,
    CertificateViewModule,
    CertificatePreviewModule,
    NotificationFilterPillsModule,
    FilterDropdownModule,
    // TemplateComposerModule,
    UploadThumbnailModalModule,
    PublishToLxpModalModule,
    KeywordsInputModalModule,
    EventCreateModalModule,
    EditLevelModalModule,
    EditExternalSkuModalModule,
    EditEnrollPolicyModalModule,
    EditCourseNameModalModule,
    EditCategoryModalModule,
    DeleteCourseConfirmModalModule,
    CreateSubCategoryModalModule,
    CreateCategoryModalModule,
    CancelEventConfirmModalModule,

    NzFormModule,
    NzTableModule,
    NzToolTipModule,
    NzEmptyModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzBreadCrumbModule,
    NzMessageModule,
    NzModalModule,
    NzDropDownModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzButtonModule,
    NzTabsModule,
    NzSpinModule,
    NzSelectModule,
    NzUploadModule
  ]
})
export class IltCourseDetailsModule {}
