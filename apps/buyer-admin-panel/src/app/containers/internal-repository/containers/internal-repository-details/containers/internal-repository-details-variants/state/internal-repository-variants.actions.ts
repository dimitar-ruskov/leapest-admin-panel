import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class GetInternalRepositoryVariants {
  static readonly type = '[AP Internal Repository Variants] Get InternalRepository Variants';

  constructor(public readonly payload: { sku: string }) { }
}

export class ChangeInternalRepositoryVariantsPaginationParams {
  static readonly type = '[AP Internal Repository Variants] Change Internal Repository Variants Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class DeleteInternalRepositoryVariant {
  static readonly type = '[AP Internal Repository Variants] Delete Internal Repository Variant';

  constructor(public readonly payload: { sku: string }) {
  }
}

export class ResetInternalRepositoryVariantsState {
  static readonly type = '[AP Internal Repository Variants] Reset Internal Repository Variants State';
}



