import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotificationsContainerComponent } from "./notifications-container.component";

const routes: Routes = [
  {
    path: '',
    component: NotificationsContainerComponent,
    children: [
      {
        path: '',
        loadChildren: async () =>
          import('./containers/notifications/notifications.module').then(
            (m) => m.NotificationsModule),
      },
      {
        path: 'details/:trigger/:recipient/:venue',
        loadChildren: async () =>
          import('./containers/notification-details/notification-details.module').then(
            (m) => m.NotificationDetailsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
