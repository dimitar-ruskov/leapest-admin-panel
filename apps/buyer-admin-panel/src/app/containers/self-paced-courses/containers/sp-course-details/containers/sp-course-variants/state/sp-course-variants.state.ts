import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Action, Selector, State, StateContext } from "@ngxs/store";

import {
  ChangeSPCourseLanguageVariantsPaginationParams,
  GetSPCourseLanguageVariants,
  ResetSPCourseLanguageVariantsState
} from "./sp-course-variants.actions";
import { SpCourseVariantCreateState } from "../sp-course-variant-create/state/sp-course-variant-create.state";
import {
  SpCourseLanguageVariantsService
} from "../../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-course-language-variants.service";

import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  IPageable,
  SPCourseLanguageVariant
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import { SpCourseVariantDetailsState } from "../sp-course-variant-details/state/sp-course-variant-details.state";

export class SpCourseVariantsStateModel {
  loading: boolean;
  spCourseLanguageVariants: SPCourseLanguageVariant[];
  total: number;
  paginationParams: IPageable;
}

@State<SpCourseVariantsStateModel>({
  name: 'spCourseVariants',
  defaults: {
    loading: false,
    spCourseLanguageVariants: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
  children: [SpCourseVariantCreateState, SpCourseVariantDetailsState]
})
@Injectable()
export class SpCourseVariantsState {
  @Selector([SpCourseVariantsState])
  static loading(state: SpCourseVariantsStateModel) {
    return state.loading;
  }

  @Selector([SpCourseVariantsState])
  static spCourseLanguageVariants(state: SpCourseVariantsStateModel) {
    return state.spCourseLanguageVariants;
  }

  @Selector([SpCourseVariantsState])
  static total(state: SpCourseVariantsStateModel) {
    return state.total;
  }

  @Selector([SpCourseVariantsState])
  static searchPhrase(state: SpCourseVariantsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([SpCourseVariantsState])
  static pageIndex(state: SpCourseVariantsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([SpCourseVariantsState])
  static pageSize(state: SpCourseVariantsStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService) {}

  @Action(GetSPCourseLanguageVariants)
  getActiveILTEvents(
    { patchState, getState }: StateContext<SpCourseVariantsStateModel>,
    action: GetSPCourseLanguageVariants,
  ) {
    const { paginationParams } = getState();
    const { id } = action.payload;
    return this.spCourseLanguageVariantsService.getSPCourseLanguageVariants(id, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: SPCourseLanguageVariant[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({
            spCourseLanguageVariants: resource.response.data,
            total: resource.response.flags.size,
          });
        }
      }),
    );
  }

  @Action(ChangeSPCourseLanguageVariantsPaginationParams)
  changeActiveILTEventsPaginationParams(
    { patchState, getState }: StateContext<SpCourseVariantsStateModel>,
    { payload }: ChangeSPCourseLanguageVariantsPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetSPCourseLanguageVariantsState)
  resetActiveILTEventsState({ patchState }: StateContext<SpCourseVariantsStateModel>) {
    patchState({
      loading: false,
      spCourseLanguageVariants: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
