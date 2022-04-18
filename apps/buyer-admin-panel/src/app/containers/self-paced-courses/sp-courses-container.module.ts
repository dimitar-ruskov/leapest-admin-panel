import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";

import { SpCoursesState } from "./state/sp-courses.state";
import { SpCoursesContainerRoutingModule } from "./sp-courses-container-routing.module";
import { SpCoursesContainerComponent } from "./sp-courses-container.component";
import { SpCoursesListState } from "./containers/sp-courses-list/state/sp-courses-list.state";
import { SpCourseDetailsState } from "./containers/sp-course-details/state/sp-course-details.state";
import { SpCourseCreateState } from "./containers/sp-course-create/state/sp-course-create.state";
import {
  SpCourseVariantsState
} from "./containers/sp-course-details/containers/sp-course-variants/state/sp-course-variants.state";
import {
  SpCourseVariantCreateState
} from "./containers/sp-course-details/containers/sp-course-variants/sp-course-variant-create/state/sp-course-variant-create.state";
import {
  SpCourseVariantDetailsState
} from "./containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/state/sp-course-variant-details.state";
import {
  DraftSpCoursesListState
} from "./containers/sp-courses-list/draft-sp-courses-list/state/draft-sp-courses-list.state";
import {
  SpCourseVariantLearnersEnrolledState
} from "./containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/containers/sp-course-variant-learners/state/sp-course-variant-learners-enrolled.state";
import {
  SpCourseVariantMaterialsTrackingState
} from "./containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/containers/sp-course-variant-materials-tracking/state/sp-course-variant-materials-tracking.state";
import {
  SpCourseVariantExamsState
} from "./containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/containers/sp-course-variant-exams/state/sp-course-variant-exams.state";
import {
  ActiveSpCoursesListState
} from "./containers/sp-courses-list/active-sp-courses-list/state/active-sp-courses-list.state";
import {
  SpCourseVariantLearnersPendingState
} from "./containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/containers/sp-course-variant-learners/state/sp-course-variant-learners-pending.state";


@NgModule({
  declarations: [
    SpCoursesContainerComponent,
  ],
  imports: [
    CommonModule,
    SpCoursesContainerRoutingModule,

    NgxsModule.forFeature([
      SpCoursesState,
      SpCoursesListState,
      ActiveSpCoursesListState,
      DraftSpCoursesListState,
      SpCourseCreateState,
      SpCourseDetailsState,

      SpCourseVariantsState,
      SpCourseVariantCreateState,
      SpCourseVariantDetailsState,
      SpCourseVariantLearnersEnrolledState,
      SpCourseVariantLearnersPendingState,
      SpCourseVariantExamsState,
      SpCourseVariantMaterialsTrackingState,
    ]),
  ],
})
export class SpCoursesContainerModule {}
