import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";

import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";

import { NotificationsComponent } from "./notifications.component";
import { NotificationsListingComponent } from "./containers/notifications-listing/notifications-listing.component";
import { NotificationsSettingsComponent } from "./containers/notifications-settings/notifications-settings.component";

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
  GeneralInfoModule
} from "../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {
  NotificationFilterPillsModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/notification-filter-pills/notification-filter-pills.module";
import { TGridModule } from "../../../../../../../../libs/shared/src/lib/components/common/t-grid/t-grid.module";
import {
  TableGridModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  NotificationLogoModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/notification-logo-modal/notification-logo-modal.module";

@NgModule({
  declarations: [NotificationsSettingsComponent, NotificationsListingComponent, NotificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: NotificationsComponent
    }]),

    NgxsFormPluginModule,
    CtaContainerModule,
    GeneralInfoModule,
    TGridModule,
    TableGridModule,
    TableControlPanelModule,
    TableSearchModule,
    NotificationFilterPillsModule,
    FilterDropdownModule,
    NotificationLogoModalModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzFormModule,
    NzInputNumberModule,
    NzSelectModule,
    NzInputModule,
    NzUploadModule,
    NzToolTipModule,
    NzEmptyModule,
    NzAlertModule,
    NzIconModule,
    NzDropDownModule
  ]
})
export class NotificationsModule {}
