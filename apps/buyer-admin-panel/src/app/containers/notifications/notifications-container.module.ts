import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { NotificationsState } from './state/notifications.state';
import { NotificationsContainerComponent } from './notifications-container.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsModule } from './containers/notifications/notifications.module';
import { NotificationDetailsModule } from './containers/notification-details/notification-details.module';
import { NotificationDetailsState } from './containers/notification-details/state/notification-details.state';
import { NotificationsListState } from './containers/notifications/state/notifications-list.state';
import { NotificationsSettingsState } from './containers/notifications/state/notifications-settings.state';

@NgModule({
  declarations: [NotificationsContainerComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      NotificationsState,
      NotificationDetailsState,
      NotificationsListState,
      NotificationsSettingsState,
    ]),
    NotificationsRoutingModule,
    NotificationsModule,
    NotificationDetailsModule,
  ],
})
export class NotificationsContainerModule {}
