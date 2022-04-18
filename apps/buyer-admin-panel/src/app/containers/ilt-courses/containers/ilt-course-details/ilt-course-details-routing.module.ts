import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
  CourseAgendaUnsavedChangesGuard,
  CourseMaterialsUnsavedChangesGuard
} from "../../../../../../../../libs/shared/src/lib/utils/guards";
import { IltCourseDetailsComponent } from "./ilt-course-details.component";
import {
  IltCourseEventsBulkUploadDetailsComponent
} from "./containers/ilt-course-events-tab/ilt-course-events-bulk/ilt-course-events-bulk-upload-details/ilt-course-events-bulk-upload-details.component";
import {
  IltCourseNotificationDetailsComponent
} from "./containers/ilt-course-notifications/ilt-course-notification-details/ilt-course-notification-details.component";


const routes: Routes = [
  {
    path: '',
    component: IltCourseDetailsComponent,
    canDeactivate: [CourseAgendaUnsavedChangesGuard, CourseMaterialsUnsavedChangesGuard],
  },
  {
    path: 'notifications/:trigger/:recipient/:venue',
    component: IltCourseNotificationDetailsComponent,
  },
  {
    path: 'report/:csvId',
    component: IltCourseEventsBulkUploadDetailsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IltCourseDetailsRoutingModule {
}
