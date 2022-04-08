import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetMarketplaceRepositories {
  static readonly type = '[Marketplace Repository List] Get Marketplace Repositories';
}

export class ChangeMarketplaceRepositoriesPaginationParams {
  static readonly type = '[Marketplace Repository List] Change Marketplace Repositories Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetMarketplaceRepositoriesState {
  static readonly type = '[Marketplace Repository List] Reset Marketplace Repositories State';
}
