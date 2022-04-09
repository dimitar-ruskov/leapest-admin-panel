import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxsModule} from "@ngxs/store";

import {IltCoursesState} from "./state/ilt-courses.state";
import { IltCoursesContainerRoutingModule } from './ilt-courses-container-routing.module';
import { IltCourseDetailsModule } from './containers/ilt-course-details/ilt-course-details.module';
import { IltCourseCreateModule } from './containers/ilt-course-create/ilt-course-create.module';
import { IltCoursesListModule } from './containers/ilt-courses-list/ilt-courses-list.module';
import { IltCoursesContainerComponent } from './ilt-courses-container.component';

@NgModule({
  declarations: [IltCoursesContainerComponent],
  imports: [
    CommonModule,
    IltCoursesContainerRoutingModule,
    NgxsModule.forFeature([IltCoursesState]),

    IltCoursesListModule,
    IltCourseDetailsModule,
    IltCourseCreateModule,
  ],
})
export class IltCoursesContainerModule {}
