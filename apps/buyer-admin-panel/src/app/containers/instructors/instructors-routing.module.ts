import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstructorsComponent } from './instructors.component';
import { InstructorsListComponent } from './containers/instructors-list/instructors-list.component';
import { InstructorDetailsComponent } from './containers/instructor-details/instructor-details.component';

const routes: Routes = [
  {
    path: '',
    component: InstructorsComponent,
    children: [
      {
        path: '',
        component: InstructorsListComponent,
      },
      {
        path: 'details/:id',
        component: InstructorDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorsRoutingModule {}
