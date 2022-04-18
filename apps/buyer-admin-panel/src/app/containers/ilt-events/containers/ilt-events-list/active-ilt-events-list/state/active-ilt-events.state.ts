import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { IltEventsService } from '../../../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service';
import {
  CancelILTEvent,
  ChangeActiveILTEventsPaginationParams,
  GetActiveILTEvents,
  ResetActiveILTEventsState,
} from './active-ilt-events.actions';

import {ILTEventListItem, IPageable} from "../../../../../../../../../../libs/shared/src/lib/models";
import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../../libs/shared/src/lib/models/constants";

export class ActiveIltEventsStateModel {
  loading: boolean;
  iltEvents: ILTEventListItem[];
  total: number;
  paginationParams: IPageable;
  pendingActionEventCount: number;
}

@State<ActiveIltEventsStateModel>({
  name: 'activeIltEvents',
  defaults: {
    loading: false,
    iltEvents: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    pendingActionEventCount: 0,
  },
})
@Injectable()
export class ActiveIltEventsState {
  @Selector([ActiveIltEventsState])
  static loading(state: ActiveIltEventsStateModel) {
    return state.loading;
  }

  @Selector([ActiveIltEventsState])
  static iltEvents(state: ActiveIltEventsStateModel) {
    return state.iltEvents;
  }

  @Selector([ActiveIltEventsState])
  static total(state: ActiveIltEventsStateModel) {
    return state.total;
  }

  @Selector([ActiveIltEventsState])
  static searchPhrase(state: ActiveIltEventsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([ActiveIltEventsState])
  static pageIndex(state: ActiveIltEventsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([ActiveIltEventsState])
  static pageSize(state: ActiveIltEventsStateModel) {
    return state.paginationParams.limit;
  }

  @Selector([ActiveIltEventsState])
  static pendingActionEventCount(state: ActiveIltEventsStateModel) {
    return state.pendingActionEventCount;
  }

  constructor(private readonly iltEventsService: IltEventsService) {}

  @Action(GetActiveILTEvents)
  getActiveILTEvents({ patchState, getState }: StateContext<ActiveIltEventsStateModel>) {
    const { paginationParams } = getState();

    return this.iltEventsService.getExtendedILTEvents('released', paginationParams).pipe(
      tap(
        (
          resource: DeferredResource<{
            data: { courseEvents: ILTEventListItem[]; pendingCount: number }[];
            flags: { size: number };
          }>,
        ) => {
          patchState({ loading: resource.isPending });

          if (resource.isSuccess) {
            patchState({
              iltEvents: resource.response.data[0].courseEvents,
              total: resource.response.flags.size,
              pendingActionEventCount: resource.response.data[0].pendingCount,
            });
          }
        },
      ),
    );
  }

  @Action(ChangeActiveILTEventsPaginationParams)
  changeActiveILTEventsPaginationParams(
    { patchState, getState }: StateContext<ActiveIltEventsStateModel>,
    { payload }: ChangeActiveILTEventsPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetActiveILTEventsState)
  resetActiveILTEventsState({ patchState }: StateContext<ActiveIltEventsStateModel>) {
    patchState({
      loading: false,
      iltEvents: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
      pendingActionEventCount: 0,
    });
  }

  @Action(CancelILTEvent)
  cancelILTEvent({ patchState, getState }: StateContext<ActiveIltEventsStateModel>, { payload }: CancelILTEvent) {
    return this.iltEventsService.cancelEvent(payload.eventId, payload.cancelReason);
  }
}
