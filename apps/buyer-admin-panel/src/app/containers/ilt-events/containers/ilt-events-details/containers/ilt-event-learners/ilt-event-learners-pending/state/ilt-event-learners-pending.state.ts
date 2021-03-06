import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import {
  IltEventLearnersService
} from "../../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-event-learners.service";
import {
  ChangePendingILTEventLearnersPaginationParams,
  GetPendingILTEventLearners,
  ResetPendingILTEventLearnersState
} from "./ilt-event-learners-pending.actions";

import { DeferredResource } from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  ILTEventLearner,
  IPageable
} from "../../../../../../../../../../../../libs/shared/src/lib/models";


export class IltEventLearnersPendingStateModel {
  loading: boolean;
  iltEventLearners: ILTEventLearner[];
  total: number;
  paginationParams: IPageable;
}

@State<IltEventLearnersPendingStateModel>({
  name: 'iltEventLearnersPending',
  defaults: {
    loading: false,
    iltEventLearners: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class IltEventLearnersPendingState {
  @Selector([IltEventLearnersPendingState])
  static loading(state: IltEventLearnersPendingStateModel) {
    return state.loading;
  }

  @Selector([IltEventLearnersPendingState])
  static iltEventLearners(state: IltEventLearnersPendingStateModel) {
    return state.iltEventLearners;
  }

  @Selector([IltEventLearnersPendingState])
  static total(state: IltEventLearnersPendingStateModel) {
    return state.total;
  }

  @Selector([IltEventLearnersPendingState])
  static searchPhrase(state: IltEventLearnersPendingStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([IltEventLearnersPendingState])
  static pageIndex(state: IltEventLearnersPendingStateModel) {
    return state.paginationParams.page;
  }

  @Selector([IltEventLearnersPendingState])
  static pageSize(state: IltEventLearnersPendingStateModel) {
    return state.paginationParams.limit;
  }


  constructor(private readonly iltEventLearnersService: IltEventLearnersService) {
  }

  @Action(GetPendingILTEventLearners)
  getPendingILTEventLearners({ patchState, getState }: StateContext<IltEventLearnersPendingStateModel>, { payload }: GetPendingILTEventLearners) {
    const { paginationParams } = getState();
    const { classEventId } = payload
    return this.iltEventLearnersService.getEventPendingLearners(classEventId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventLearner[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltEventLearners: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(ChangePendingILTEventLearnersPaginationParams)
  changePendingILTEventLearnersPaginationParams({ patchState, getState }: StateContext<IltEventLearnersPendingStateModel>,
    { payload }: ChangePendingILTEventLearnersPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetPendingILTEventLearnersState)
  resetPendingILTEventLearnersState({ patchState }: StateContext<IltEventLearnersPendingStateModel>) {
    patchState({
      loading: false,
      iltEventLearners: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
