import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsContainerComponent } from './notifications-container.component';
import { NotificationsComponent } from './containers/notifications/notifications.component';
import { NotificationDetailsComponent } from './containers/notification-details/notification-details.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsContainerComponent,
    children: [
      {
        path: '',
        component: NotificationsComponent,
      },
      {
        path: 'details/:trigger/:recipient/:venue',
        component: NotificationDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
