import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IltCoursesContainerComponent } from "./ilt-courses-container.component";

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
            .then((m) => m.IltCourseDetailsModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IltCoursesContainerRoutingModule {}
