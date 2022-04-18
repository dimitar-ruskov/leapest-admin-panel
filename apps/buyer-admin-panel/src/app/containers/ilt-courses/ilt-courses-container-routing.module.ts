import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IltCoursesContainerComponent } from './ilt-courses-container.component';
import { IltCourseNotificationDetailsComponent } from './containers/ilt-course-details/containers/ilt-course-notifications/ilt-course-notification-details/ilt-course-notification-details.component';
import {
  IltCourseEventsBulkUploadDetailsComponent
} from "./containers/ilt-course-details/containers/ilt-course-events-tab/ilt-course-events-bulk/ilt-course-events-bulk-upload-details/ilt-course-events-bulk-upload-details.component";

import {CourseAgendaUnsavedChangesGuard, CourseMaterialsUnsavedChangesGuard} from "../../../../../../libs/shared/src/lib/utils/guards";

const routes: Routes = [
  {
    path: '',
    component: IltCoursesContainerComponent,
    children: [
      {
        path: '',
        loadChildren: async () =>
          import('./containers/ilt-courses-list/ilt-courses-list.module')
            .then((m) => m.IltCoursesListModule)
      },
      {
        path: 'create/:id',
        loadChildren: async () =>
          import('./containers/ilt-course-create/ilt-course-create.module')
            .then((m) => m.IltCourseCreateModule)
      },
      {
        path: 'details/:id',
        loadChildren: async () =>
          import('./containers/ilt-course-details/ilt-course-details.module')
            .then((m) => m.IltCourseDetailsModule),
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
