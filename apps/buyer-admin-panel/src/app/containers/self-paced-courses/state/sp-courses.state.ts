import { Injectable } from "@angular/core";
import { State } from "@ngxs/store";
import { SpCoursesListState } from "../containers/sp-courses-list/state/sp-courses-list.state";
import { SpCourseCreateState } from "../containers/sp-course-create/state/sp-course-create.state";
import { SpCourseDetailsState } from "../containers/sp-course-details/state/sp-course-details.state";
import {
  SpCourseVariantsState
} from "../containers/sp-course-details/containers/sp-course-variants/state/sp-course-variants.state";

@State({
  name: 'selfPacedCourses',
  children: [
    SpCourseCreateState,
    SpCoursesListState,
    SpCourseDetailsState,

    SpCourseVariantsState
  ]
})
@Injectable()
export class SpCoursesState {}
