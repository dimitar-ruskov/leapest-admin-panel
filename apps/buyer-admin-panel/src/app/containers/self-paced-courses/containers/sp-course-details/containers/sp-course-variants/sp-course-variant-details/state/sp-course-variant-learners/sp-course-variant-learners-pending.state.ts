import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {take, tap} from 'rxjs/operators';
import { patch } from '@ngxs/store/operators';

import { SpCourseLanguageVariantsService } from '../../../../../../../services/sp-course-language-variants.service';
import {
  ChangeSPCourseLanguageVariantLearnersPendingPage,
  ChangeSPCourseLanguageVariantLearnersPendingPaginationParams, ExportLearnerFromEvent,
  GetSPCourseLanguageVariantLearnersPending,
  SpliceSPCourseLanguageVariantLearnersPending,
} from './sp-course-variant-learners-pending.actions';

import { SPCourseLanguageVariantLearner } from '../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course-language-variant-learner.model';
import {DeferredResource} from "../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS
} from "../../../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {IPageable} from "../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {NzMessageService} from "ng-zorro-antd/message";

export class SpCourseVariantLearnersPendingStateModel {
  loading: boolean;
  learners: SPCourseLanguageVariantLearner[] | null;
  total: number;
  paginationParams: IPageable;
}

@State<SpCourseVariantLearnersPendingStateModel>({
  name: 'spCourseVariantLearnersPending',
  defaults: {
    loading: false,
    learners: null,
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class SpCourseVariantLearnersPendingState {
  @Selector([SpCourseVariantLearnersPendingState])
  static loading(state: SpCourseVariantLearnersPendingStateModel) {
    return state.loading;
  }

  @Selector([SpCourseVariantLearnersPendingState])
  static learners(state: SpCourseVariantLearnersPendingStateModel) {
    return state.learners;
  }

  @Selector([SpCourseVariantLearnersPendingState])
  static total(state: SpCourseVariantLearnersPendingStateModel) {
    return state.total;
  }

  @Selector([SpCourseVariantLearnersPendingState])
  static pageIndex(state: SpCourseVariantLearnersPendingStateModel) {
    return state.paginationParams.page;
  }

  @Selector([SpCourseVariantLearnersPendingState])
  static pageSize(state: SpCourseVariantLearnersPendingStateModel) {
    return state.paginationParams.limit;
  }

  constructor(
    private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService,
    private readonly messageService: NzMessageService,
  ) {}

  @Action(GetSPCourseLanguageVariantLearnersPending)
  getSPCourseLanguageVariantLearnersPending(
    { patchState, getState }: StateContext<SpCourseVariantLearnersPendingStateModel>,
    action: GetSPCourseLanguageVariantLearnersPending,
  ) {
    const { id } = action.payload;
    const { paginationParams } = getState();

    return this.spCourseLanguageVariantsService
      .getSPCourseLanguageVariantLearners(id, paginationParams, 'pending')
      .pipe(
        tap((resource: DeferredResource<{ data: SPCourseLanguageVariantLearner[]; flags: { size: number } }>) => {
          patchState({ loading: resource.isPending });

          if (resource.isSuccess) {
            patchState({ learners: resource.response.data, total: resource.response.flags.size });
          }
        }),
      );
  }

  @Action(ChangeSPCourseLanguageVariantLearnersPendingPaginationParams)
  changeSPCourseLanguageVariantLearnersPendingPaginationParams(
    { patchState, getState }: StateContext<SpCourseVariantLearnersPendingStateModel>,
    { payload }: ChangeSPCourseLanguageVariantLearnersPendingPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ChangeSPCourseLanguageVariantLearnersPendingPage)
  changeSPCourseLanguageVariantLearnersPendingPage(
    { patchState, setState }: StateContext<SpCourseVariantLearnersPendingStateModel>,
    action: ChangeSPCourseLanguageVariantLearnersPendingPage,
  ) {
    const { page } = action.payload;

    setState(patch({ paginationParams: patch({ page }) }));
  }

  @Action(SpliceSPCourseLanguageVariantLearnersPending)
  spliceSPCourseLanguageVariantLearnersEnrolled(
    { patchState, getState }: StateContext<SpCourseVariantLearnersPendingStateModel>,
    { payload }: SpliceSPCourseLanguageVariantLearnersPending,
  ) {
    const { learnerUserNames } = payload;
    const currentLearners = getState().learners;
    const filteredLearners = currentLearners.filter((learner) => {
      return !learnerUserNames.includes(learner.username);
    });

    patchState({
      learners: filteredLearners,
      total: filteredLearners.length,
    });
  }

  @Action(ExportLearnerFromEvent)
  exportLearnerFromILTEvent(
    { patchState, getState }: StateContext<SpCourseVariantLearnersPendingStateModel>,
    { payload }: ExportLearnerFromEvent,
  ): void {
    this.spCourseLanguageVariantsService
      .exportLearners(payload)
      .pipe(take(1))
      .subscribe(() => {
        this.messageService.success('Report will be sent on your email');
      });
  }
}
