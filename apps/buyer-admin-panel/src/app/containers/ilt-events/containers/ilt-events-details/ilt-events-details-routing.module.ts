import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {IltEventsDetailsComponent} from "./ilt-events-details.component";
import {
  IltEventNotificationDetailsComponent
} from "./containers/ilt-event-notifications/ilt-event-notification-details/ilt-event-notification-details.component";


const routes: Routes = [
  {
    path: '',
    component: IltEventsDetailsComponent
  },
  {
    path: 'notifications/:trigger/:recipient/:venue',
    component: IltEventNotificationDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IltEventsDetailsRoutingModule {
}
