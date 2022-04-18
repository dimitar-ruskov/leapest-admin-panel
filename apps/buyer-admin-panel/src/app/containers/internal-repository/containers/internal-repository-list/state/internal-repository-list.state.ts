import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import {
  ChangeInternalRepositoriesPaginationParams,
  DeleteInternalRepository,
  GetInternalRepositories,
  ResetInternalRepositoriesState
} from "./internal-repository-list.actions";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  InternalRepository,
  IPageable
} from "../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  InternalRepositoryService
} from "../../../../../../../../../libs/shared/src/lib/services/materials/internal-repo/internal-repository.service";

export class InternalRepositoryListStateModel {
  loading: boolean;
  internalRepositories: InternalRepository[];
  total: number;
  paginationParams: IPageable;
}
@State<InternalRepositoryListStateModel>({
  name: 'internalRepositoryList',
  defaults: {
    loading: false,
    internalRepositories: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class InternalRepositoryListState {
  @Selector()
  static loading(state: InternalRepositoryListStateModel) {
    return state.loading;
  }

  @Selector()
  static internalRepositories(state: InternalRepositoryListStateModel) {
    return state.internalRepositories;
  }

  @Selector()
  static total(state: InternalRepositoryListStateModel) {
    return state.total;
  }

  @Selector()
  static searchPhrase(state: InternalRepositoryListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector()
  static pageIndex(state: InternalRepositoryListStateModel) {
    return state.paginationParams.page;
  }

  @Selector()
  static pageSize(state: InternalRepositoryListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly internalRepositoryService: InternalRepositoryService) {}

  @Action(GetInternalRepositories)
  getInternalRepositories({ patchState, getState }: StateContext<InternalRepositoryListStateModel>) {
    const { paginationParams } = getState();

    return this.internalRepositoryService.getInternalRepositories(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: InternalRepository[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ internalRepositories: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeInternalRepositoriesPaginationParams)
  changeActiveSPCoursesPaginationParams(
    { patchState, getState }: StateContext<InternalRepositoryListStateModel>,
    { payload }: ChangeInternalRepositoriesPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetInternalRepositoriesState)
  resetActiveSPCoursesState({ patchState }: StateContext<InternalRepositoryListStateModel>) {
    patchState({
      loading: false,
      internalRepositories: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }

  @Action(DeleteInternalRepository)
  deleteInternalRepository(
    { patchState, getState, dispatch }: StateContext<InternalRepositoryListStateModel>,
    { payload }: DeleteInternalRepository,
  ) {
    const sku = payload.sku;
    return this.internalRepositoryService.deleteInternalRepository(sku);
  }
}
