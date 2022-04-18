import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";

import { NotificationsState } from "./state/notifications.state";
import { NotificationsContainerComponent } from "./notifications-container.component";
import { NotificationsRoutingModule } from "./notifications-routing.module";
import { NotificationsListState } from "./containers/notifications/state/notifications-list.state";
import { NotificationsSettingsState } from "./containers/notifications/state/notifications-settings.state";
import { NotificationDetailsState } from "./containers/notification-details/state/notification-details.state";

@NgModule({
  declarations: [NotificationsContainerComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    NgxsModule.forFeature([
      NotificationsState,
      NotificationsListState,
      NotificationsSettingsState,
      NotificationDetailsState
    ]),
  ],
})
export class NotificationsContainerModule {}
