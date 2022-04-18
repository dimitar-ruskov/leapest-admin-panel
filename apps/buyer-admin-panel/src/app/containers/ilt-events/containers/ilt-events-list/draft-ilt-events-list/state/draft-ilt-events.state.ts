import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { IltEventsService } from '../../../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service';
import { ChangeDraftILTEventsPaginationParams, GetDraftILTEvents, ResetDraftILTEventsState } from './draft-ilt-events.actions';

import {ILTEventListItem, IPageable} from "../../../../../../../../../../libs/shared/src/lib/models";
import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../../libs/shared/src/lib/models/constants";

export class DraftIltEventsStateModel {
  loading: boolean;
  iltEvents: ILTEventListItem[];
  total: number;
  paginationParams: IPageable;
}


@State<DraftIltEventsStateModel>({
  name: 'draftIltEvents',
  defaults: {
    loading: false,
    iltEvents: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class DraftIltEventsState {
  @Selector([DraftIltEventsState])
  static loading(state: DraftIltEventsStateModel) {
    return state.loading;
  }

  @Selector([DraftIltEventsState])
  static iltEvents(state: DraftIltEventsStateModel) {
    return state.iltEvents;
  }

  @Selector([DraftIltEventsState])
  static total(state: DraftIltEventsStateModel) {
    return state.total;
  }

  @Selector([DraftIltEventsState])
  static searchPhrase(state: DraftIltEventsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([DraftIltEventsState])
  static pageIndex(state: DraftIltEventsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([DraftIltEventsState])
  static pageSize(state: DraftIltEventsStateModel) {
    return state.paginationParams.limit;
  }


  constructor(private readonly iltEventsService: IltEventsService) {
  }

  @Action(GetDraftILTEvents)
  getDraftILTEvents({ patchState, getState }: StateContext<DraftIltEventsStateModel>) {
    const { paginationParams } = getState();

    return this.iltEventsService.getILTEvents('draft', paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventListItem[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltEvents: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(ChangeDraftILTEventsPaginationParams)
  changeDraftILTEventsPaginationParams({ patchState, getState }: StateContext<DraftIltEventsStateModel>,
    { payload }: ChangeDraftILTEventsPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetDraftILTEventsState)
  resetDraftILTEventsState({ patchState }: StateContext<DraftIltEventsStateModel>) {
    patchState({
      loading: false,
      iltEvents: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
