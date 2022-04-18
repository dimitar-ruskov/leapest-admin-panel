import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import {IltEventsDetailsRoutingModule} from "./ilt-events-details-routing.module";
import { IltEventsDetailsComponent } from './ilt-events-details.component';
import { IltEventLearnersEnrolledComponent } from './containers/ilt-event-learners/ilt-event-learners-enrolled/ilt-event-learners-enrolled.component';
import { IltEventLearnersPendingComponent } from './containers/ilt-event-learners/ilt-event-learners-pending/ilt-event-learners-pending.component';
import { IltEventInfoComponent } from './containers/ilt-event-info/ilt-event-info.component';
import { IltEventMaterialsTrackingComponent } from './containers/ilt-event-materials-tracking/ilt-event-materials-tracking.component';
import { IltEventExamsComponent } from './containers/ilt-event-exams/ilt-event-exams.component';
import { AttendanceTrackingModule } from '../../../../../../../../libs/shared/src/lib/components/feature/attendance-tracking/attendance-tracking.module';
import { WaitingListComponent } from './containers/waiting-list/waiting-list.component';
import { EventReviewsComponent } from './containers/ilt-event-reviews/ilt-event-reviews.component';
import { IltEventNotificationDetailsComponent } from './containers/ilt-event-notifications/ilt-event-notification-details/ilt-event-notification-details.component';
import { IltEventNotificationsComponent } from './containers/ilt-event-notifications/ilt-event-notifications.component';
import { EmailHistoryComponent } from './containers/ilt-event-notifications/ilt-event-notification-details/email-history/email-history.component';
import { IltEventLearnersUnenrolledComponent } from './containers/ilt-event-learners/ilt-event-learners-unenrolled/ilt-event-learners-unenrolled.component';
import { IltEventLearnersComponent } from './containers/ilt-event-learners/ilt-event-learners.component';
import { FlattenedCourseInfoModule } from '../../../../../../../../libs/shared/src/lib/components/feature/flattened-course-info/flattened-course-info.module';
import { EventDetailsInfoModule } from '../../../../../../../../libs/shared/src/lib/components/feature/event-details-info/event-details-info.module';
import {AttendanceTrackingComponent} from "./containers/attendance-tracking/attendance-tracking.component";

import {
  FormLabelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  NotificationFilterPillsModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/notification-filter-pills/notification-filter-pills.module";
import {
  InternalRepoTileModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/internal-repo/internal-repo-tile/internal-repo-tile.module";
import {
  EventHeaderSectionsModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/event-header-sections/event-header-sections.module";
import {TAgendaModule} from "../../../../../../../../libs/shared/src/lib/components/feature/t-agenda/t-agenda.module";
import {
  ConcatMaterialsPipeModule
} from "../../../../../../../../libs/shared/src/lib/utils/pipes/concat-materials-pipe/concat-materials-pipe.module";
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
  FilterDropdownModule
} from "../../../../../../../../libs/shared/src/lib/components/common/filter-dropdown/filter-dropdown.module";
import {
  CtaContainerModule
} from "../../../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  GroupMasterInternalReposByTypePipeModule
} from "../../../../../../../../libs/shared/src/lib/utils/pipes/group-master-internal-repos-by-type-pipe/group-master-internal-repos-by-type-pipe.module";
import {
  HtmlBypassPipeModule
} from "../../../../../../../../libs/shared/src/lib/utils/pipes/html-bypass/html-bypass-pipe.module";
import {
  NotificationRecipientsModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/notification-recipients-modal/notification-recipients-modal.module";
import {
  EditWaitingListModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-waiting-list-modal/edit-waiting-list-modal.module";
import {
  EditVirtualMeetingsModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-virtual-meetings-modal/edit-virtual-meetings-modal.module";
import {
  EditTimezoneModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-timezone-modal/edit-timezone-modal.module";
import {
  EditNumberOfLearnersModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-number-of-learners-modal/edit-number-of-learners-modal.module";
import {
  EditLanguageModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-language-modal/edit-language-modal.module";
import {
  EditInstructorsModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-instructors-modal/edit-instructors-modal.module";
import {
  EditConferenceLinkModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-conference-link-modal/edit-conference-link-modal.module";
import {
  EditAttendanceTrackingSettingsModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-attendance-tracking-settings-modal/edit-attendance-tracking-settings-modal.module";
import {
  EditAddressModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/edit-address-modal/edit-address-modal.module";
import {
  BulkAttendanceTrackingSelectionModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/bulk-attendance-tracking-selection-modal/bulk-attendance-tracking-selection-modal.module";
import {
  BasicUserModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/basic-user-modal/basic-user-modal.module";
import {
  AddAddressModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/add-address-modal/add-address-modal.module";
import {
  TemplateComposerModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/template-composer/template-composer.module";
import {
  ResendEmailModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/resend-email-modal/resend-email-modal.module";


@NgModule({
  declarations: [
    IltEventsDetailsComponent,
    IltEventLearnersComponent,
    IltEventLearnersUnenrolledComponent,
    IltEventLearnersEnrolledComponent,
    IltEventLearnersPendingComponent,
    IltEventInfoComponent,
    IltEventMaterialsTrackingComponent,
    IltEventExamsComponent,
    WaitingListComponent,
    EventReviewsComponent,
    IltEventNotificationsComponent,
    IltEventNotificationDetailsComponent,
    EmailHistoryComponent,
    AttendanceTrackingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IltEventsDetailsRoutingModule,

    NgxsFormPluginModule,
    FlattenedCourseInfoModule,
    EventDetailsInfoModule,
    AttendanceTrackingModule,
    TemplateComposerModule,
    TableSearchModule,
    NotificationFilterPillsModule,
    FilterDropdownModule,
    CtaContainerModule,
    EventHeaderSectionsModule,
    InternalRepoTileModule,
    TableControlPanelModule,
    TableGridModule,
    TableSearchModule,
    GroupMasterInternalReposByTypePipeModule,
    ConcatMaterialsPipeModule,
    FormLabelModule,
    TAgendaModule,
    HtmlBypassPipeModule,
    NotificationRecipientsModalModule,
    EditWaitingListModalModule,
    EditVirtualMeetingsModalModule,
    EditTimezoneModalModule,
    EditNumberOfLearnersModalModule,
    EditLanguageModalModule,
    EditInstructorsModalModule,
    EditConferenceLinkModalModule,
    EditAttendanceTrackingSettingsModalModule,
    BulkAttendanceTrackingSelectionModalModule,
    EditAddressModalModule,
    BasicUserModalModule,
    AddAddressModalModule,
    ResendEmailModalModule,

    NzTabsModule,
    NzEmptyModule,
    NzSkeletonModule,
    NzSpinModule,
    NzLayoutModule,
    NzTableModule,
    NzToolTipModule,
    NzButtonModule,
    NzAlertModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzCardModule,
    RouterModule,
    NzBreadCrumbModule,
    NzMessageModule,
    NzModalModule,
    NzDropDownModule,
  ],
})
export class IltEventsDetailsModule {}
