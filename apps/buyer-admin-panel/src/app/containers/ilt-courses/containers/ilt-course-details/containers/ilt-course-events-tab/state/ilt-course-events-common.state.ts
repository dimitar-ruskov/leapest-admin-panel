import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  CancelCourseEvent,
  ChangeEventsPaginationParams,
  GetAllEventsByType,
  ResetCourseEventsState
} from "./ilt-course-events-common.actions";
import {
  IltCoursesService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/ilt-courses/ilt-courses.service";

import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  ILTEventListItem,
  IPageable
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";

export class IltCourseEventsCommonStateModel {
  loading: boolean;
  courseEvents: ILTEventListItem[];
  total: number;
  paginationParams: IPageable;
}

@State<IltCourseEventsCommonStateModel>({
  name: 'iltCourseEventsCommon',
  defaults: {
    loading: false,
    courseEvents: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class IltCourseEventsCommonState {
  @Selector([IltCourseEventsCommonState])
  static loading(state: IltCourseEventsCommonStateModel) {
    return state.loading;
  }

  @Selector([IltCourseEventsCommonState])
  static courseEvents(state: IltCourseEventsCommonStateModel) {
    return state.courseEvents;
  }

  @Selector([IltCourseEventsCommonState])
  static total(state: IltCourseEventsCommonStateModel) {
    return state.total;
  }

  @Selector([IltCourseEventsCommonState])
  static pageIndex(state: IltCourseEventsCommonStateModel) {
    return state.paginationParams.page;
  }

  @Selector([IltCourseEventsCommonState])
  static pageSize(state: IltCourseEventsCommonStateModel) {
    return state.paginationParams.limit;
  }

  constructor(
    private readonly iltCoursesService: IltCoursesService
  ) {}

  @Action(GetAllEventsByType)
  getAllEventsByType(
    { patchState, getState }: StateContext<IltCourseEventsCommonStateModel>,
    { payload }: GetAllEventsByType,
  ) {
    const { paginationParams } = getState();
    const { status, parentId } = payload;

    return this.iltCoursesService.getILTCourseEventsLite(status, parentId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventListItem[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ courseEvents: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeEventsPaginationParams)
  changeCourseEventsPaginationParams(
    { patchState, getState }: StateContext<IltCourseEventsCommonStateModel>,
    { payload }: ChangeEventsPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetCourseEventsState)
  resetCourseEventsState({ patchState }: StateContext<IltCourseEventsCommonStateModel>) {
    patchState({
      loading: false,
      courseEvents: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }

  @Action(CancelCourseEvent)
  cancelILTEvent({ patchState, getState }: StateContext<IltCourseEventsCommonStateModel>, { payload }: CancelCourseEvent) {
    return this.iltCoursesService.cancelEvent(payload.eventId, payload.cancelReason);
  }
}
