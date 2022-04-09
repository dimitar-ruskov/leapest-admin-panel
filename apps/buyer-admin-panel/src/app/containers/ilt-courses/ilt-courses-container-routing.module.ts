import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IltCoursesContainerComponent } from './ilt-courses-container.component';
import { IltCoursesListComponent } from './containers/ilt-courses-list/ilt-courses-list.component';
import { IltCourseCreateComponent } from './containers/ilt-course-create/ilt-course-create.component';
import { IltCourseDetailsComponent } from './containers/ilt-course-details/ilt-course-details.component';
import { IltCourseNotificationDetailsComponent } from './containers/ilt-course-details/containers/ilt-course-notifications/ilt-course-notification-details/ilt-course-notification-details.component';
import {
  IltCourseEventsBulkUploadDetailsComponent
} from "./containers/ilt-course-details/containers/ilt-course-events-tab/ilt-course-events-bulk/components/ilt-course-events-bulk-upload-details/ilt-course-events-bulk-upload-details.component";

import {CourseAgendaUnsavedChangesGuard, CourseMaterialsUnsavedChangesGuard} from "../../../../../../libs/shared/src/lib/utils/guards";

const routes: Routes = [
  {
    path: '',
    component: IltCoursesContainerComponent,
    children: [
      {
        path: '',
        component: IltCoursesListComponent,
      },
      {
        path: 'create/:id',
        component: IltCourseCreateComponent,
      },
      {
        path: 'details/:id',
        component: IltCourseDetailsComponent,
        canDeactivate: [CourseAgendaUnsavedChangesGuard, CourseMaterialsUnsavedChangesGuard],
      },
      {
        path: 'details/:id/notifications/:trigger/:recipient/:venue',
        component: IltCourseNotificationDetailsComponent,
      },
      {
        path: 'details/:id/report/:csvId',
        component: IltCourseEventsBulkUploadDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IltCoursesContainerRoutingModule {}