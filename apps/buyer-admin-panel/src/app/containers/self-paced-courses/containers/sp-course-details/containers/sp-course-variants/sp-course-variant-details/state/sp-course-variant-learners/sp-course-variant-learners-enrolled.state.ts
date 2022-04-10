import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { filter, take, tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

import { SpCourseLanguageVariantsService } from '../../../../../../../services/sp-course-language-variants.service';
import {
  ChangeSPCourseLanguageVariantLearnersEnrolledPage,
  ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams,
  ExportLearnerFromSPCourseLanguageVariantLearnersEnrolled,
  GetSPCourseLanguageVariantLearnersEnrolled,
  SpliceSPCourseLanguageVariantLearnersEnrolled,
} from './sp-course-variant-learners-enrolled.actions';

import { SPCourseLanguageVariantLearner } from '../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course-language-variant-learner.model';
import {DeferredResource} from "../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS
} from "../../../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {IPageable} from "../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";


export class SpCourseVariantLearnersEnrolledStateModel {
  loading: boolean;
  learners: SPCourseLanguageVariantLearner[] | null;
  total: number;
  paginationParams: IPageable;
}

@State<SpCourseVariantLearnersEnrolledStateModel>({
  name: 'spCourseVariantLearnersEnrolled',
  defaults: {
    loading: false,
    learners: null,
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class SpCourseVariantLearnersEnrolledState {
  @Selector([SpCourseVariantLearnersEnrolledState])
  static loading(state: SpCourseVariantLearnersEnrolledStateModel) {
    return state.loading;
  }

  @Selector([SpCourseVariantLearnersEnrolledState])
  static learners(state: SpCourseVariantLearnersEnrolledStateModel) {
    return state.learners;
  }

  @Selector([SpCourseVariantLearnersEnrolledState])
  static total(state: SpCourseVariantLearnersEnrolledStateModel) {
    return state.total;
  }

  @Selector([SpCourseVariantLearnersEnrolledState])
  static pageIndex(state: SpCourseVariantLearnersEnrolledStateModel) {
    return state.paginationParams.page;
  }

  @Selector([SpCourseVariantLearnersEnrolledState])
  static pageSize(state: SpCourseVariantLearnersEnrolledStateModel) {
    return state.paginationParams.limit;
  }

  constructor(
    private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService,
    private readonly messageService: NzMessageService,
  ) {}

  @Action(GetSPCourseLanguageVariantLearnersEnrolled)
  getSPCourseLanguageVariantLearnersEnrolled(
    { patchState, getState }: StateContext<SpCourseVariantLearnersEnrolledStateModel>,
    action: GetSPCourseLanguageVariantLearnersEnrolled,
  ) {
    const { id } = action.payload;
    const { paginationParams } = getState();

    return this.spCourseLanguageVariantsService.getSPCourseLanguageVariantLearners(id, paginationParams, 'active').pipe(
      tap((resource: DeferredResource<{ data: SPCourseLanguageVariantLearner[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ learners: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams)
  ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams(
    { patchState, getState }: StateContext<SpCourseVariantLearnersEnrolledStateModel>,
    { payload }: ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ChangeSPCourseLanguageVariantLearnersEnrolledPage)
  changeSPCourseLanguageVariantLearnersEnrolledPage(
    { patchState, setState }: StateContext<SpCourseVariantLearnersEnrolledStateModel>,
    action: ChangeSPCourseLanguageVariantLearnersEnrolledPage,
  ) {
    const { page } = action.payload;

    setState(
      patch({
        paginationParams: patch({
          page,
        }),
      }),
    );
  }

  @Action(SpliceSPCourseLanguageVariantLearnersEnrolled)
  spliceSPCourseLanguageVariantLearnersEnrolled(
    { patchState, getState }: StateContext<SpCourseVariantLearnersEnrolledStateModel>,
    { payload }: SpliceSPCourseLanguageVariantLearnersEnrolled,
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

  @Action(ExportLearnerFromSPCourseLanguageVariantLearnersEnrolled)
  exportLearnerFromILTEvent(
    { patchState, getState }: StateContext<SpCourseVariantLearnersEnrolledStateModel>,
    { payload }: ExportLearnerFromSPCourseLanguageVariantLearnersEnrolled,
  ): void {
    this.spCourseLanguageVariantsService
      .exportLearners(payload)
      .pipe(
        filter((resp) => !resp.pending),
        take(1),
      )
      .subscribe((data) => {
        this.messageService.success('Report will be sent on your email');
      });
  }
}
