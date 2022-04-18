import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { patch } from "@ngxs/store/operators";

import {
  SpCourseLanguageVariantsService
} from "../../../../../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-course-language-variants.service";
import {
  ChangeSPCourseLanguageVariantExamSKU,
  ChangeSPCourseLanguageVariantExamsPage,
  GetSPCourseLanguageVariantExams
} from "./sp-course-variant-exams.actions";

import { DeferredResource } from "../../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  IPageable,
  SPCourseLanguageVariantExam
} from "../../../../../../../../../../../../../../libs/shared/src/lib/models";


export class SpCourseVariantExamsStateModel {
  exams: DeferredResource<{ data: SPCourseLanguageVariantExam[], flags: { size: number } }> | null;
  examVariantSKU: string;
  paginationParams: IPageable;
}

@State<SpCourseVariantExamsStateModel>({
  name: 'spCourseVariantExams',
  defaults: {
    exams: null,
    examVariantSKU: null,
    paginationParams: { limit: 10, page: 1, filter: '', filterParams: [], sort: null }
  }
})
@Injectable()
export class SpCourseVariantExamsState {

  @Selector([SpCourseVariantExamsState])
  static exams(state: SpCourseVariantExamsStateModel) {
    return state.exams;
  }

  @Selector([SpCourseVariantExamsState])
  static paginationParams(state: SpCourseVariantExamsStateModel) {
    return state.paginationParams;
  }

  constructor(
    private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService
  ) {
  }

  @Action(GetSPCourseLanguageVariantExams)
  getSPCourseLanguageVariantExams({ patchState, getState }: StateContext<SpCourseVariantExamsStateModel>,
                                  { payload }: GetSPCourseLanguageVariantExams
  ) {
    const { paginationParams, examVariantSKU } = getState();
    const sku = payload.examVariantSKU || examVariantSKU;

    return this.spCourseLanguageVariantsService.getSPCourseLanguageVariantExams(payload.id, sku, paginationParams)
      .pipe(tap((resource: DeferredResource<{ data: SPCourseLanguageVariantExam[], flags: { size: number } }>) => {
        patchState({ exams: resource });
      }));
  }

  @Action(ChangeSPCourseLanguageVariantExamSKU)
  changeSPCourseLanguageVariantExamSKU(
    { patchState, setState }: StateContext<SpCourseVariantExamsStateModel>,
    action: ChangeSPCourseLanguageVariantExamSKU
  ) {
    const { examVariantSKU } = action.payload;

    patchState({
      examVariantSKU
    });
  }

  @Action(ChangeSPCourseLanguageVariantExamsPage)
  changeSPCourseLanguageVariantExamsPage(
    { patchState, setState }: StateContext<SpCourseVariantExamsStateModel>,
    action: ChangeSPCourseLanguageVariantExamsPage
  ) {
    const { page } = action.payload;

    setState(patch({
      paginationParams: patch({
        page
      })
    }));
  }
}
