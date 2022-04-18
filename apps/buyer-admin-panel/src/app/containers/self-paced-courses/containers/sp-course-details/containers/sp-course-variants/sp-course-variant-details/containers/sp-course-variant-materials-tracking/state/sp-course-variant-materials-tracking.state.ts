import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { patch } from "@ngxs/store/operators";

import {
  SpCourseLanguageVariantsService
} from "../../../../../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-course-language-variants.service";
import {
  ChangeSPCourseLanguageVariantMaterialSKU,
  ChangeSPCourseLanguageVariantMaterialsTrackingPage,
  GetSPCourseLanguageVariantMaterialsTrackingList
} from "./sp-course-variant-materials-tracking.actions";

import { DeferredResource } from "../../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  IPageable,
  MaterialCompletionReport
} from "../../../../../../../../../../../../../../libs/shared/src/lib/models";


export class SpCourseVariantMaterialsTrackingStateModel {
  materialsTrackingList: DeferredResource<{ data: MaterialCompletionReport[], flags: { size: number } }> | null;
  materialSKU: string;
  paginationParams: IPageable;
}

@State<SpCourseVariantMaterialsTrackingStateModel>({
  name: 'spCourseVariantMaterialsTracking',
  defaults: {
    materialsTrackingList: null,
    materialSKU: null,
    paginationParams: { limit: 10, page: 1, filter: '', filterParams: [], sort: null }
  }
})
@Injectable()
export class SpCourseVariantMaterialsTrackingState {
  @Selector([SpCourseVariantMaterialsTrackingState])
  static materialsTrackingList(state: SpCourseVariantMaterialsTrackingStateModel) {
    return state.materialsTrackingList;
  }

  @Selector([SpCourseVariantMaterialsTrackingState])
  static paginationParams(state: SpCourseVariantMaterialsTrackingStateModel) {
    return state.paginationParams;
  }

  constructor(
    private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService
  ) {
  }

  @Action(ChangeSPCourseLanguageVariantMaterialSKU)
  changeSPCourseLanguageVariantMaterialSKU(
    { patchState, getState }: StateContext<SpCourseVariantMaterialsTrackingStateModel>,
    { payload }: ChangeSPCourseLanguageVariantMaterialSKU
  ) {
    const { materialSKU } = payload;

    patchState({materialSKU});
  }

  @Action(GetSPCourseLanguageVariantMaterialsTrackingList)
  getSPCourseLanguageVariantMaterialsTrackingList(
    { patchState, getState }: StateContext<SpCourseVariantMaterialsTrackingStateModel>,
    { payload }: GetSPCourseLanguageVariantMaterialsTrackingList
  ) {
    const { paginationParams, materialSKU } = getState();

    return this.spCourseLanguageVariantsService.getSPCourseLanguageVariantMaterialsTrackingList(payload.id, materialSKU, paginationParams)
      .pipe(tap((resource: DeferredResource<{ data: MaterialCompletionReport[], flags: { size: number } }>) => {
        patchState({ materialsTrackingList: resource });
      }));
  }

  @Action(ChangeSPCourseLanguageVariantMaterialsTrackingPage)
  changeSPCourseLanguageVariantMaterialsTrackingPage(
    { setState }: StateContext<SpCourseVariantMaterialsTrackingStateModel>,
    { payload }: ChangeSPCourseLanguageVariantMaterialsTrackingPage
  ) {
    const { page } = payload;

    setState(patch({
      paginationParams: patch({
        page
      })
    }));
  }
}
