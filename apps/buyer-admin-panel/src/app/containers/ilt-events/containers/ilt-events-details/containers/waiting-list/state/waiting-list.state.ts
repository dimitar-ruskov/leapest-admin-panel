import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs";

import {
  WaitingListService
} from "../../../../../../../../../../../libs/shared/src/lib/services/events/waiting-list.service";
import {
  AddWaitingListLearners,
  ChangeWaitingListPaginationParams,
  DemoteWaitingListLearner,
  GetWaitingList,
  PromoteWaitingListLearner,
  RemoveWaitingListLearners,
  ResetWaitingListState
} from "./waiting-list.actions";

import {
  AssignLearnersResponse,
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  ILTEventLearner,
  IPageable
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";

export class WaitingListStateModel {
  loading: boolean;
  waitingListLearners: ILTEventLearner[];
  total: number;
  paginationParams: IPageable;
}

@State<WaitingListStateModel>({
  name: 'waitingList',
  defaults: {
    loading: false,
    waitingListLearners: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class WaitingListState {
  @Selector([WaitingListState])
  static loading(state: WaitingListStateModel) {
    return state.loading;
  }

  @Selector([WaitingListState])
  static waitingListLearners(state: WaitingListStateModel) {
    return state.waitingListLearners;
  }

  @Selector([WaitingListState])
  static total(state: WaitingListStateModel) {
    return state.total;
  }

  @Selector([WaitingListState])
  static searchPhrase(state: WaitingListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([WaitingListState])
  static pageIndex(state: WaitingListStateModel) {
    return state.paginationParams.page;
  }

  @Selector([WaitingListState])
  static pageSize(state: WaitingListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly waitingListService: WaitingListService) {}

  @Action(GetWaitingList)
  getWaitingList({ patchState, getState }: StateContext<WaitingListStateModel>, { payload }: GetWaitingList) {
    const { paginationParams } = getState();
    const { classEventId } = payload;
    return this.waitingListService.getEventWaitingListLearners(classEventId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventLearner[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ waitingListLearners: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeWaitingListPaginationParams)
  changeWaitingListPaginationParams(
    { patchState, getState }: StateContext<WaitingListStateModel>,
    { payload }: ChangeWaitingListPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetWaitingListState)
  resetPendingILTEventLearnersState({ patchState }: StateContext<WaitingListStateModel>) {
    patchState({
      loading: false,
      waitingListLearners: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }

  @Action(PromoteWaitingListLearner)
  promoteWaitingListLearner(
    { patchState, getState, dispatch }: StateContext<WaitingListStateModel>,
    { eventId, data }: PromoteWaitingListLearner,
  ) {
    patchState({ loading: true });
    return this.waitingListService.promoteLearner(eventId, data).pipe(
      tap((res: AssignLearnersResponse) => {
        if (res) {
          dispatch([new GetWaitingList({ classEventId: eventId })]);
        }
      }),
    );
  }

  @Action(DemoteWaitingListLearner)
  demoteWaitingListLearner(
    { patchState, getState, dispatch }: StateContext<WaitingListStateModel>,
    { eventId, data }: DemoteWaitingListLearner,
  ) {
    patchState({ loading: true });
    return this.waitingListService.demoteLearner(eventId, data).pipe(
      tap((res: AssignLearnersResponse) => {
        if (res) {
          dispatch([new GetWaitingList({ classEventId: eventId })]);
        }
      }),
    );
  }

  @Action(AddWaitingListLearners)
  addWaitingListLearners(
    { patchState, getState, dispatch }: StateContext<WaitingListStateModel>,
    { classEventId, learners }: AddWaitingListLearners,
  ) {
    patchState({ loading: true });
    return this.waitingListService.addLearnersWaitingList(classEventId, learners).pipe(
      tap((res: AssignLearnersResponse) => {
        if (res) {
          dispatch([new GetWaitingList({ classEventId })]);
        }
      }),
    );
  }

  @Action(RemoveWaitingListLearners)
  removeWaitingListLearners(
    { patchState, getState, dispatch }: StateContext<WaitingListStateModel>,
    { classEventId, learners }: RemoveWaitingListLearners,
  ) {
    patchState({ loading: true });
    return this.waitingListService.removeLearnersWaitingList(classEventId, learners).pipe(
      tap((res: AssignLearnersResponse) => {
        if (res) {
          dispatch([new GetWaitingList({ classEventId })]);
        }
      }),
      catchError((_) => {
        patchState({ loading: false });
        return of(null);
      }),
    );
  }
}
