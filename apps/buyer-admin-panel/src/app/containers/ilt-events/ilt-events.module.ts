import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";

import { IltEventsRoutingModule } from "./ilt-events-routing.module";
import { IltEventsComponent } from "./ilt-events.component";
import { IltEventsState } from "./state/ilt-events.state";

import { IltEventsCreateState } from "./containers/ilt-events-create/state/ilt-events-create.state";
import {
  ActiveIltEventsState
} from "./containers/ilt-events-list/active-ilt-events-list/state/active-ilt-events.state";
import {
  FinishedIltEventsState
} from "./containers/ilt-events-list/finished-ilt-events-list/state/finished-ilt-events.state";
import { DraftIltEventsState } from "./containers/ilt-events-list/draft-ilt-events-list/state/draft-ilt-events.state";
import { IltEventsListState } from "./containers/ilt-events-list/state/ilt-events.state";
import { IltEventDetailsState } from "./containers/ilt-events-details/state/ilt-event-details.state";
import {
  IltEventLearnersEnrolledState
} from "./containers/ilt-events-details/containers/ilt-event-learners/ilt-event-learners-enrolled/state/ilt-event-learners-enrolled.state";
import {
  IltEventLearnersUnenrolledState
} from "./containers/ilt-events-details/containers/ilt-event-learners/ilt-event-learners-unenrolled/state/ilt-event-learners-unenrolled.state";
import {
  IltEventLearnersPendingState
} from "./containers/ilt-events-details/containers/ilt-event-learners/ilt-event-learners-pending/state/ilt-event-learners-pending.state";
import {
  IltEventMaterialsTrackingState
} from "./containers/ilt-events-details/containers/ilt-event-materials-tracking/state/ilt-event-materials-tracking.state";
import {
  IltEventExamsState
} from "./containers/ilt-events-details/containers/ilt-event-exams/state/ilt-event-exams.state";
import { WaitingListState } from "./containers/ilt-events-details/containers/waiting-list/state/waiting-list.state";
import {
  EventReviewsState
} from "./containers/ilt-events-details/containers/ilt-event-reviews/state/ilt-event-reviews.state";
import {
  IltEventDetailsNotificationsState
} from "./containers/ilt-events-details/containers/ilt-event-notifications/state/ilt-event-details-notifications.state";
import {
  EmailHistoryState
} from "./containers/ilt-events-details/containers/ilt-event-notifications/ilt-event-notification-details/email-history/state/email-history.state";

@NgModule({
  declarations: [IltEventsComponent],
  imports: [
    CommonModule,
    IltEventsRoutingModule,

    NgxsModule.forFeature([
      IltEventsState,
      IltEventsCreateState,

      IltEventsListState,
      ActiveIltEventsState,
      FinishedIltEventsState,
      DraftIltEventsState,

      IltEventDetailsState,
      IltEventLearnersEnrolledState,
      IltEventLearnersUnenrolledState,
      IltEventLearnersPendingState,
      IltEventMaterialsTrackingState,
      IltEventExamsState,
      WaitingListState,
      EventReviewsState,
      IltEventDetailsNotificationsState,
      EmailHistoryState,
    ]),
  ]
})
export class IltEventsModule { }
