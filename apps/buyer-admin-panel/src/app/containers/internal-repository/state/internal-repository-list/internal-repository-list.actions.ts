import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetInternalRepositories {
  static readonly type = '[Internal Repository List] Get Internal Repositories';
}
export class ChangeInternalRepositoriesPaginationParams {
  static readonly type = '[Internal Repository List] Change Internal Repositories Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}
export class ResetInternalRepositoriesState {
  static readonly type = '[Internal Repository List] Reset Internal Repositories State';
}

export class DeleteInternalRepository {
  static readonly type = '[Internal Repository List] Delete Internal Repository';

  constructor(public readonly payload: { sku: string }) {}
}
