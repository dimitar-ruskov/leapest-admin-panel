import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  IltEventLearnersService
} from "../../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-event-learners.service";
import {
  ChangeUnenrolledILTEventLearnersPaginationParams,
  GetUnenrolledILTEventLearners,
  ResetUnenrolledILTEventLearnersState
} from "./ilt-event-learners-unenrolled.actions";

import { DeferredResource } from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  ILTEventLearner,
  IPageable
} from "../../../../../../../../../../../../libs/shared/src/lib/models";


export class IltEventLearnersUnenrolledStateModel {
  loading: boolean;
  iltEventLearners: ILTEventLearner[];
  total: number;
  paginationParams: IPageable;
}

@State<IltEventLearnersUnenrolledStateModel>({
  name: 'iltEventLearnersUnenrolled',
  defaults: {
    loading: false,
    iltEventLearners: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class IltEventLearnersUnenrolledState {
  @Selector([IltEventLearnersUnenrolledState])
  static loading(state: IltEventLearnersUnenrolledStateModel): boolean {
    return state.loading;
  }

  @Selector([IltEventLearnersUnenrolledState])
  static iltEventLearners(state: IltEventLearnersUnenrolledStateModel): ILTEventLearner[] {
    return state.iltEventLearners;
  }

  @Selector([IltEventLearnersUnenrolledState])
  static total(state: IltEventLearnersUnenrolledStateModel): number {
    return state.total;
  }

  @Selector([IltEventLearnersUnenrolledState])
  static searchPhrase(state: IltEventLearnersUnenrolledStateModel): string {
    return state.paginationParams.filter;
  }

  @Selector([IltEventLearnersUnenrolledState])
  static pageIndex(state: IltEventLearnersUnenrolledStateModel): number {
    return state.paginationParams.page;
  }

  @Selector([IltEventLearnersUnenrolledState])
  static pageSize(state: IltEventLearnersUnenrolledStateModel): number {
    return state.paginationParams.limit;
  }

  constructor(private readonly iltEventLearnersService: IltEventLearnersService) {}

  @Action(GetUnenrolledILTEventLearners)
  getUnenrolledILTEventLearners(
    { patchState, getState }: StateContext<IltEventLearnersUnenrolledStateModel>,
    { payload }: GetUnenrolledILTEventLearners,
  ) {
    const { paginationParams } = getState();
    const { classEventId } = payload;
    return this.iltEventLearnersService.getEventUnenrolledLearners(classEventId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventLearner[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltEventLearners: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeUnenrolledILTEventLearnersPaginationParams)
  changeUnenrolledILTEventLearnersPaginationParams(
    { patchState, getState }: StateContext<IltEventLearnersUnenrolledStateModel>,
    { payload }: ChangeUnenrolledILTEventLearnersPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetUnenrolledILTEventLearnersState)
  resetUnenrolledILTEventLearnersState({ patchState }: StateContext<IltEventLearnersUnenrolledStateModel>) {
    patchState({
      loading: false,
      iltEventLearners: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
