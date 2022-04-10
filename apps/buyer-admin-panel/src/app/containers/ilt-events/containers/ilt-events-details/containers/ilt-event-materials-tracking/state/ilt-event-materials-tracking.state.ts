import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {IltEventsService} from '../../../../../services/ilt-events.service';

import {
  ChangeILTEventMaterialTrackingFilterSKU,
  ChangeILTEventMaterialTrackingListPaginationParams,
  GetILTEventMaterialTrackingList,
  ResetILTEventMaterialTrackingListState
} from './ilt-event-materials-tracking.actions';

import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {
  IPageable,
  MaterialCompletionReport
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class IltEventMaterialsTrackingStateModel {
  filterSku: string;
  loading: boolean;
  iltEventMaterialTrackingList: MaterialCompletionReport[];
  total: number;
  paginationParams: IPageable;
}


@State<IltEventMaterialsTrackingStateModel>({
  name: 'iltEventMaterialsTracking',
  defaults: {
    loading: false,
    iltEventMaterialTrackingList: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    filterSku: ''
  }
})
@Injectable()
export class IltEventMaterialsTrackingState {

  @Selector([IltEventMaterialsTrackingState])
  static loading(state: IltEventMaterialsTrackingStateModel) {
    return state.loading;
  }

  @Selector([IltEventMaterialsTrackingState])
  static iltEventMaterialTrackingList(state: IltEventMaterialsTrackingStateModel) {
    return state.iltEventMaterialTrackingList;
  }

  @Selector([IltEventMaterialsTrackingState])
  static total(state: IltEventMaterialsTrackingStateModel) {
    return state.total;
  }

  @Selector([IltEventMaterialsTrackingState])
  static searchPhrase(state: IltEventMaterialsTrackingStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([IltEventMaterialsTrackingState])
  static pageIndex(state: IltEventMaterialsTrackingStateModel) {
    return state.paginationParams.page;
  }

  @Selector([IltEventMaterialsTrackingState])
  static pageSize(state: IltEventMaterialsTrackingStateModel) {
    return state.paginationParams.limit;
  }

  @Selector([IltEventMaterialsTrackingState])
  static filterSku(state: IltEventMaterialsTrackingStateModel) {
    return state.filterSku;
  }



  constructor(private iltEventsService: IltEventsService) { }

  @Action(GetILTEventMaterialTrackingList)
  getILTEventMaterialTrackingList({ patchState, getState }: StateContext<IltEventMaterialsTrackingStateModel>, { payload }: GetILTEventMaterialTrackingList) {
    const { paginationParams, filterSku } = getState();
    const { eventId } = payload
    if (filterSku) {
      return this.iltEventsService.getEventMaterialTrackingList(eventId, filterSku, paginationParams).pipe(
        tap((resource: DeferredResource<{ data: MaterialCompletionReport[], flags: { size: number } }>) => {
          patchState({ loading: resource.isPending });

          if (resource.isSuccess) {
            patchState({ iltEventMaterialTrackingList: resource.response.data, total: resource.response.flags.size });
          }
        })
      );
    }
  }

  @Action(ChangeILTEventMaterialTrackingListPaginationParams)
  changeEnrolledILTEventLearnersPaginationParams({ patchState, getState }: StateContext<IltEventMaterialsTrackingStateModel>,
    { payload }: ChangeILTEventMaterialTrackingListPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetILTEventMaterialTrackingListState)
  resetEnrolledILTEventLearnersState({ patchState }: StateContext<IltEventMaterialsTrackingStateModel>) {
    patchState({
      loading: false,
      iltEventMaterialTrackingList: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
      filterSku: ''
    });
  }

  @Action(ChangeILTEventMaterialTrackingFilterSKU)
  changeSPCourseLanguageVariantMaterialSKU(
    { patchState, getState }: StateContext<IltEventMaterialsTrackingStateModel>,
    { payload }: ChangeILTEventMaterialTrackingFilterSKU
  ) {
    const { materialSKU } = payload;

    patchState({ filterSku: materialSKU });
  }
}
