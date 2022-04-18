import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IltEventsService } from '../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service';
import { ChangeILTEventExamsFilterSKU, ChangeILTEventExamsPaginationParams, GetILTEventExams, ResetILTEventExamsState } from './ilt-event-exams.actions';

import {ExamCompletionReport, IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";
import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";

export class IltEventExamsStateModel {
  filterSku: string;
  loading: boolean;
  iltEventExams: ExamCompletionReport[];
  total: number;
  paginationParams: IPageable;
}


@State<IltEventExamsStateModel>({
  name: 'iltEventExams',
  defaults: {
    loading: false,
    iltEventExams: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    filterSku: ''
  }
})
@Injectable()
export class IltEventExamsState {

  @Selector([IltEventExamsState])
  static loading(state: IltEventExamsStateModel) {
    return state.loading;
  }

  @Selector([IltEventExamsState])
  static iltEventExams(state: IltEventExamsStateModel) {
    return state.iltEventExams;
  }

  @Selector([IltEventExamsState])
  static total(state: IltEventExamsStateModel) {
    return state.total;
  }

  @Selector([IltEventExamsState])
  static searchPhrase(state: IltEventExamsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([IltEventExamsState])
  static pageIndex(state: IltEventExamsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([IltEventExamsState])
  static pageSize(state: IltEventExamsStateModel) {
    return state.paginationParams.limit;
  }

  @Selector([IltEventExamsState])
  static filterSku(state: IltEventExamsStateModel) {
    return state.filterSku;
  }



  constructor(private iltEventsService: IltEventsService) { }

  @Action(GetILTEventExams)
  getILTEventExams({ patchState, getState }: StateContext<IltEventExamsStateModel>, { payload }: GetILTEventExams) {
    const { paginationParams, filterSku } = getState();
    const { eventId } = payload
    if (filterSku) {
      return this.iltEventsService.getILTEventExams(eventId, filterSku, paginationParams).pipe(
        tap((resource: DeferredResource<{ data: ExamCompletionReport[], flags: { size: number } }>) => {
          patchState({ loading: resource.isPending });

          if (resource.isSuccess) {
            patchState({ iltEventExams: resource.response.data, total: resource.response.flags.size });
          }
        })
      );
    }
  }

  @Action(ChangeILTEventExamsPaginationParams)
  changeEnrolledILTEventLearnersPaginationParams({ patchState, getState }: StateContext<IltEventExamsStateModel>,
    { payload }: ChangeILTEventExamsPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetILTEventExamsState)
  resetEnrolledILTEventLearnersState({ patchState }: StateContext<IltEventExamsStateModel>) {
    patchState({
      loading: false,
      iltEventExams: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
      filterSku: ''
    });
  }

  @Action(ChangeILTEventExamsFilterSKU)
  changeSPCourseLanguageVariantMaterialSKU(
    { patchState, getState }: StateContext<IltEventExamsStateModel>,
    { payload }: ChangeILTEventExamsFilterSKU
  ) {
    const { materialSKU } = payload;

    patchState({ filterSku: materialSKU });
  }

}
