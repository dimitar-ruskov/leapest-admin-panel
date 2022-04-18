import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IltEventsDetailsComponent } from "./ilt-events-details.component";
import {
  IltEventNotificationDetailsComponent
} from "./containers/ilt-event-notifications/ilt-event-notification-details/ilt-event-notification-details.component";
import { EventAgendaUnsavedChangesGuard } from "../../../../../../../../libs/shared/src/lib/utils/guards";


const routes: Routes = [
  {
    path: '',
    component: IltEventsDetailsComponent,
    canDeactivate: [EventAgendaUnsavedChangesGuard]
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
