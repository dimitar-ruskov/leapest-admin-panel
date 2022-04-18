import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxsModule} from "@ngxs/store";

import { IltCoursesContainerComponent } from './ilt-courses-container.component';
import {IltCoursesState} from "./state/ilt-courses.state";
import { IltCoursesContainerRoutingModule } from './ilt-courses-container-routing.module';
import {ILTCourseCreateState} from "./containers/ilt-course-create/state/ilt-course-create.state";
import {IltCoursesListState} from "./containers/ilt-courses-list/state/ilt-courses-list.state";
import {DraftILTCoursesState} from "./containers/ilt-courses-list/draft-ilt-courses-list/state/draft-ilt-courses.state";
import {PublishedILTCoursesState} from "./containers/ilt-courses-list/published-ilt-courses-list/state/published-ilt-courses.state";
import {
  IltCourseReviewsState
} from "./containers/ilt-course-details/containers/ilt-course-reviews/state/ilt-course-reviews.state";
import {IltCourseDetailsState} from "./containers/ilt-course-details/state/ilt-course-details.state";
import {
  IltCourseDetailsNotificationsState
} from "./containers/ilt-course-details/containers/ilt-course-notifications/state/ilt-course-details-notifications.state";
import {
  IltCourseEventsCommonState
} from "./containers/ilt-course-details/containers/ilt-course-events-tab/state/ilt-course-events-common.state";
import {
  IltCourseEventsBulkUploadsState
} from "./containers/ilt-course-details/containers/ilt-course-events-tab/ilt-course-events-bulk/state/ilt-course-events-bulk.state";

@NgModule({
  declarations: [IltCoursesContainerComponent],
  imports: [
    CommonModule,
    IltCoursesContainerRoutingModule,

    NgxsModule.forFeature([
      IltCoursesState,
      ILTCourseCreateState,
      IltCoursesListState,
      DraftILTCoursesState,
      PublishedILTCoursesState,
      IltCourseDetailsState,
      IltCourseReviewsState,
      IltCourseDetailsNotificationsState,
      IltCourseEventsCommonState,
      IltCourseEventsBulkUploadsState
    ]),
  ],
})
export class IltCoursesContainerModule {}
