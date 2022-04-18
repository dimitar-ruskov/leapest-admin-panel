import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SpCoursesContainerComponent } from "./sp-courses-container.component";

const routes: Routes = [
  {
    path: '',
    component: SpCoursesContainerComponent,
    children: [
      {
        path: '',
        loadChildren: async () =>
          import('./containers/sp-courses-list/sp-courses-list.module')
            .then((m) => m.SpCoursesListModule)
      },
      {
        path: 'create/:id',
        loadChildren: async () =>
          import('./containers/sp-course-create/sp-course-create.module')
            .then((m) => m.SpCourseCreateModule)
      },
      {
        path: 'details/:id',
        loadChildren: async () =>
          import('./containers/sp-course-details/sp-course-details.module')
            .then((m) => m.SpCourseDetailsModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpCoursesContainerRoutingModule { }
