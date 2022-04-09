import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

import {ILTCourseCreateState} from "../containers/ilt-course-create/state/ilt-course-create.state";
import {IltCoursesListState} from "../containers/ilt-courses-list/state/ilt-courses-list.state";
import {IltCourseDetailsState} from "../containers/ilt-course-details/state/ilt-course-details.state";

@State({
  name: 'iltCourses',
  children: [
    ILTCourseCreateState,
    IltCoursesListState,
    IltCourseDetailsState
  ]
})
@Injectable()
export class IltCoursesState {}
