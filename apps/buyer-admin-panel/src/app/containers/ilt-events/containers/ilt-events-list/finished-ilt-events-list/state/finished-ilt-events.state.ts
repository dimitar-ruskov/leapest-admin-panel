import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import { IltEventsService } from "../../../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service";
import {
  ChangeFinishedILTEventsPaginationParams,
  GetFinishedILTEvents,
  ResetFinishedILTEventsState
} from "./finished-ilt-events.actions";

import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  ILTEventListItem,
  IPageable
} from "../../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";

export class FinishedIltEventsStateModel {
  loading: boolean;
  iltEvents: ILTEventListItem[];
  total: number;
  paginationParams: IPageable;
}

@State<FinishedIltEventsStateModel>({
  name: 'finishedIltEvents',
  defaults: {
    loading: false,
    iltEvents: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class FinishedIltEventsState {
  @Selector([FinishedIltEventsState])
  static loading(state: FinishedIltEventsStateModel) {
    return state.loading;
  }

  @Selector([FinishedIltEventsState])
  static iltEvents(state: FinishedIltEventsStateModel) {
    return state.iltEvents;
  }

  @Selector([FinishedIltEventsState])
  static total(state: FinishedIltEventsStateModel) {
    return state.total;
  }

  @Selector([FinishedIltEventsState])
  static searchPhrase(state: FinishedIltEventsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([FinishedIltEventsState])
  static pageIndex(state: FinishedIltEventsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([FinishedIltEventsState])
  static pageSize(state: FinishedIltEventsStateModel) {
    return state.paginationParams.limit;
  }


  constructor(private readonly iltEventsService: IltEventsService) {
  }

  @Action(GetFinishedILTEvents)
  getFinishedILTEvents({ patchState, getState }: StateContext<FinishedIltEventsStateModel>) {
    const { paginationParams } = getState();

    return this.iltEventsService.getILTEvents('finished', paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventListItem[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltEvents: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(ChangeFinishedILTEventsPaginationParams)
  changeFinishedILTEventsPaginationParams({ patchState, getState }: StateContext<FinishedIltEventsStateModel>,
    { payload }: ChangeFinishedILTEventsPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable }});
  }

  @Action(ResetFinishedILTEventsState)
  resetFinishedILTEventsState({ patchState }: StateContext<FinishedIltEventsStateModel>) {
    patchState({
      loading: false,
      iltEvents: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
