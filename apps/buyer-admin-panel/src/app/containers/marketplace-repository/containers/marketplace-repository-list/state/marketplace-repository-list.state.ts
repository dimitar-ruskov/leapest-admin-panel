import {ApolloQueryResult} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { MarketplaceRepositoryService } from '../../../../../../../../../libs/shared/src/lib/services/repository/marketplace/marketplace-repository.service';
import {
  ChangeMarketplaceRepositoriesPaginationParams,
  GetMarketplaceRepositories,
  ResetMarketplaceRepositoriesState,
} from './marketplace-repository-list.actions';
import { IApolloResp, IMarketplaceProduct } from '../../../../../../../../../libs/shared/src/lib/models/marketplace-repo/marketplace-repository-product.model';

import { of } from 'rxjs';
import {IPageable} from "../../../../../../../../../libs/shared/src/lib/models";

export const INITIAL_PAGINATION_PARAMS: IPageable = {
  limit: 10,
  page: 1,
  filter: '',
};

export class MarketplaceRepositoryListStateModel {
  loading: boolean;
  marketplaceRepositories: IMarketplaceProduct[];
  total: number;
  paginationParams: IPageable;
}
@State<MarketplaceRepositoryListStateModel>({
  name: 'marketplaceRepositoryList',
  defaults: {
    loading: false,
    marketplaceRepositories: [],
    total: 0,
    paginationParams: INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class MarketplaceRepositoryListState {
  @Selector()
  static loading(state: MarketplaceRepositoryListStateModel) {
    return state.loading;
  }

  @Selector()
  static marketplaceRepositories(state: MarketplaceRepositoryListStateModel) {
    return state.marketplaceRepositories;
  }

  @Selector()
  static total(state: MarketplaceRepositoryListStateModel) {
    return state.total;
  }

  @Selector()
  static searchPhrase(state: MarketplaceRepositoryListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector()
  static pageIndex(state: MarketplaceRepositoryListStateModel) {
    return state.paginationParams.page;
  }

  @Selector()
  static pageSize(state: MarketplaceRepositoryListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly marketplaceRepositoryService: MarketplaceRepositoryService) {}

  @Action(GetMarketplaceRepositories)
  getMarketplaceProducts({ patchState, getState }: StateContext<MarketplaceRepositoryListStateModel>) {
    const { paginationParams } = getState();
    patchState({ loading: true });
    return this.marketplaceRepositoryService.list(paginationParams).pipe(
      tap((resource: ApolloQueryResult<{ results: IApolloResp }>) => {
        if (!resource.loading) {
          patchState({
            marketplaceRepositories: resource.data.results.products,
            loading: resource.loading,
            total: resource.data.results.metadata.totalCount,
          });
        }
      }),
      catchError((error) => {
        patchState({ loading: false });
        return of(error);
      }),
    );
  }

  @Action(ChangeMarketplaceRepositoriesPaginationParams)
  changeActiveMRCoursesPaginationParams(
    { patchState, getState }: StateContext<MarketplaceRepositoryListStateModel>,
    { payload }: ChangeMarketplaceRepositoriesPaginationParams,
  ) {
    const { paginationParams } = getState();
    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetMarketplaceRepositoriesState)
  resetActiveMPCoursesState({ patchState }: StateContext<MarketplaceRepositoryListStateModel>) {
    patchState({
      loading: false,
      marketplaceRepositories: [],
      total: 0,
      paginationParams: INITIAL_PAGINATION_PARAMS,
    });
  }
}
