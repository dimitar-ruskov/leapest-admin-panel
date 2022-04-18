import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  ChangeEventReviewsPaginationParams,
  DeleteCourseEventReview,
  GetCourseEventReviews,
  ResetEventReviewsListState
} from "./ilt-event-reviews.actions";
import {
  IltEventsService
} from "../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service";

import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  EventReview,
  IPageable
} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class EventReviewsStateModel {
  loading: boolean;
  eventReviews: EventReview[];
  total: number;
  paginationParams: IPageable;
}

@State<EventReviewsStateModel>({
  name: 'eventReviews',
  defaults: {
    loading: false,
    eventReviews: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class EventReviewsState {
  @Selector([EventReviewsState])
  static loading(state: EventReviewsStateModel) {
    return state.loading;
  }

  @Selector([EventReviewsState])
  static eventReviews(state: EventReviewsStateModel) {
    return state.eventReviews;
  }

  @Selector([EventReviewsState])
  static total(state: EventReviewsStateModel) {
    return state.total;
  }

  @Selector([EventReviewsState])
  static searchPhrase(state: EventReviewsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([EventReviewsState])
  static pageIndex(state: EventReviewsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([EventReviewsState])
  static pageSize(state: EventReviewsStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly iltEventService: IltEventsService) {}

  @Action(GetCourseEventReviews)
  getEventReviews({ patchState, getState }: StateContext<EventReviewsStateModel>, { eventId }: GetCourseEventReviews) {
    const { paginationParams } = getState();

    return this.iltEventService.getEventReviews(eventId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: EventReview[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          const responseSize = resource.response.flags.size;

          patchState({ eventReviews: resource.response.data, total: responseSize ? responseSize : 0 });
        }
      }),
    );
  }

  @Action(DeleteCourseEventReview)
  deleteCourseEventReview(
    { getState, patchState, setState }: StateContext<EventReviewsStateModel>,
    { payload: { id, eventId } }: DeleteCourseEventReview,
  ) {
    return this.iltEventService.deleteCourseEventReviews(id, eventId)
  }

  @Action(ChangeEventReviewsPaginationParams)
  changeEventReviewsPaginationParams(
    { patchState, getState }: StateContext<EventReviewsStateModel>,
    { payload }: ChangeEventReviewsPaginationParams,
  ) {
    const { paginationParams } = getState();
    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetEventReviewsListState)
  resetEventReviewListState({ patchState }: StateContext<EventReviewsStateModel>) {
    patchState({
      loading: false,
      eventReviews: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
