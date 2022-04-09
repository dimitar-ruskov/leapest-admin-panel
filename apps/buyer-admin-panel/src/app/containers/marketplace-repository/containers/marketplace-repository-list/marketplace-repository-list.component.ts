import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MarketplaceRepositoryListState } from './state/marketplace-repository-list.state';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  ChangeMarketplaceRepositoriesPaginationParams,
  GetMarketplaceRepositories,
  ResetMarketplaceRepositoriesState,
} from './state/marketplace-repository-list.actions';
import { IMarketplaceProduct } from '../../../../../../../../libs/shared/src/lib/models/interfaces/marketplace-repo/marketplace-repository-product.model';
import {createPageableFromTableQueryParams} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {EnvironmentService} from "../../../../../../../../libs/shared/src/lib/utils/services/common";
import {CURRENCY_DICTIONARY} from "../../../../../../../../libs/shared/src/lib/models/constants";

@Component({
  selector: 'leap-marketplace-repository-list',
  templateUrl: './marketplace-repository-list.component.html',
  styleUrls: ['./marketplace-repository-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketplaceRepositoryListComponent implements OnInit {
  @Select(MarketplaceRepositoryListState.loading)
  loading$: Observable<boolean>;

  @Select(MarketplaceRepositoryListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(MarketplaceRepositoryListState.pageSize)
  pageSize$: Observable<number>;

  @Select(MarketplaceRepositoryListState.total)
  total$: Observable<number>;

  @Select(MarketplaceRepositoryListState.pageIndex)
  pageIndex$: Observable<number>;

  @Select(MarketplaceRepositoryListState.marketplaceRepositories)
  marketplaceRepositories$: Observable<IMarketplaceProduct[]>;

  trackByFn: TrackByFunction<IMarketplaceProduct> = (index, item) => item.sku;

  readonly CURRENCY_DICTIONARY = CURRENCY_DICTIONARY;

  constructor(private readonly store: Store, public readonly environment: EnvironmentService) {}

  ngOnInit(): void {
    this.store.dispatch([new ResetMarketplaceRepositoriesState()]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const { page, limit } = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeMarketplaceRepositoriesPaginationParams({ pageable: { page, limit } }),
      new GetMarketplaceRepositories(),
    ]);
  }

  public isImgAvailable(mpRepo): boolean {
    return !!mpRepo.productVariants?.[0]?.renders?.[0]?.mediumImageUri;
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeMarketplaceRepositoriesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetMarketplaceRepositories(),
    ]);
  }
}
