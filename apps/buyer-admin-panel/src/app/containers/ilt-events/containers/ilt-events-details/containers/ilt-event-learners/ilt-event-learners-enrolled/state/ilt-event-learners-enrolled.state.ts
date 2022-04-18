import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { IltEventLearnersService } from '../../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-event-learners.service';
import { ChangeEnrolledILTEventLearnersPaginationParams, GetEnrolledILTEventLearners, ResetEnrolledILTEventLearnersState } from './ilt-event-learners-enrolled.actions';

import {DeferredResource} from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {ILTEventLearner, IPageable} from "../../../../../../../../../../../../libs/shared/src/lib/models";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS
} from "../../../../../../../../../../../../libs/shared/src/lib/models/constants";

export class IltEventLearnersEnrolledStateModel {
  loading: boolean;
  iltEventLearners: ILTEventLearner[];
  total: number;
  paginationParams: IPageable;
}


@State<IltEventLearnersEnrolledStateModel>({
  name: 'iltEventLearnersEnrolled',
  defaults: {
    loading: false,
    iltEventLearners: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class IltEventLearnersEnrolledState {
  @Selector([IltEventLearnersEnrolledState])
  static loading(state: IltEventLearnersEnrolledStateModel) {
    return state.loading;
  }

  @Selector([IltEventLearnersEnrolledState])
  static iltEventLearners(state: IltEventLearnersEnrolledStateModel) {
    return state.iltEventLearners;
  }

  @Selector([IltEventLearnersEnrolledState])
  static total(state: IltEventLearnersEnrolledStateModel) {
    return state.total;
  }

  @Selector([IltEventLearnersEnrolledState])
  static searchPhrase(state: IltEventLearnersEnrolledStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([IltEventLearnersEnrolledState])
  static pageIndex(state: IltEventLearnersEnrolledStateModel) {
    return state.paginationParams.page;
  }

  @Selector([IltEventLearnersEnrolledState])
  static pageSize(state: IltEventLearnersEnrolledStateModel) {
    return state.paginationParams.limit;
  }


  constructor(private readonly iltEventLearnersService: IltEventLearnersService) {
  }

  @Action(GetEnrolledILTEventLearners)
  getEnrolledILTEventLearners({ patchState, getState }: StateContext<IltEventLearnersEnrolledStateModel>, { payload }: GetEnrolledILTEventLearners) {
    const { paginationParams } = getState();
    const { classEventId } = payload
    return this.iltEventLearnersService.getEventActiveLearners(classEventId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventLearner[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltEventLearners: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(ChangeEnrolledILTEventLearnersPaginationParams)
  changeEnrolledILTEventLearnersPaginationParams({ patchState, getState }: StateContext<IltEventLearnersEnrolledStateModel>,
    { payload }: ChangeEnrolledILTEventLearnersPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetEnrolledILTEventLearnersState)
  resetEnrolledILTEventLearnersState({ patchState }: StateContext<IltEventLearnersEnrolledStateModel>) {
    patchState({
      loading: false,
      iltEventLearners: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }


}
