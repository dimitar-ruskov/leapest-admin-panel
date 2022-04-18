import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  ChangeInternalRepositoryVariantsPaginationParams,
  DeleteInternalRepositoryVariant,
  GetInternalRepositoryVariants,
  ResetInternalRepositoryVariantsState
} from "./internal-repository-variants.actions";

import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  InternalRepositoryVariantDTO,
  IPageable
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import {
  InternalRepositoryService
} from "../../../../../../../../../../../libs/shared/src/lib/services/materials/internal-repo/internal-repository.service";

export class InternalRepositoryVariantsStateModel {
  loading: boolean;
  internalRepositoryVariants: InternalRepositoryVariantDTO[];
  total: number;
  paginationParams: IPageable;
}

@State<InternalRepositoryVariantsStateModel>({
  name: 'internalRepositoryVariants',
  defaults: {
    loading: false,
    internalRepositoryVariants: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class InternalRepositoryVariantsState {
  @Selector()
  static loading(state: InternalRepositoryVariantsStateModel) {
    return state.loading;
  }

  @Selector()
  static internalRepositoryVariants(state: InternalRepositoryVariantsStateModel) {
    return state.internalRepositoryVariants;
  }

  @Selector()
  static total(state: InternalRepositoryVariantsStateModel) {
    return state.total;
  }

  @Selector()
  static searchPhrase(state: InternalRepositoryVariantsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector()
  static pageIndex(state: InternalRepositoryVariantsStateModel) {
    return state.paginationParams.page;
  }

  @Selector()
  static pageSize(state: InternalRepositoryVariantsStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly service: InternalRepositoryService) {}

  @Action(GetInternalRepositoryVariants)
  getInternalRepositoryVariants(
    { patchState, getState }: StateContext<InternalRepositoryVariantsStateModel>,
    action: GetInternalRepositoryVariants,
  ) {
    const { sku } = action.payload;
    const { paginationParams } = getState();

    return this.service.getInternalRepositoryVariants(sku, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: InternalRepositoryVariantDTO[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ internalRepositoryVariants: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeInternalRepositoryVariantsPaginationParams)
  changeInternalRepositoryVariantsPaginationParams(
    { patchState, getState }: StateContext<InternalRepositoryVariantsStateModel>,
    { payload }: ChangeInternalRepositoryVariantsPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(DeleteInternalRepositoryVariant)
  deleteInternalRepositoryVariant(
    { patchState, getState, dispatch }: StateContext<InternalRepositoryVariantsStateModel>,
    { payload }: DeleteInternalRepositoryVariant,
  ) {
    const sku = payload.sku;
    return this.service.deleteInternalRepositoryVariant(sku);
  }

  @Action(ResetInternalRepositoryVariantsState)
  resetActiveSPCoursesState({ patchState }: StateContext<InternalRepositoryVariantsStateModel>) {
    patchState({
      loading: false,
      internalRepositoryVariants: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
