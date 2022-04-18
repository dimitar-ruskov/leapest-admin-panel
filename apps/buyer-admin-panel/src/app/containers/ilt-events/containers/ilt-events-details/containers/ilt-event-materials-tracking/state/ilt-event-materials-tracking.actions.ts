import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class ChangeILTEventMaterialTrackingFilterSKU {
  static readonly type = '[AP ILT Event Material Tracking] Change ILT Event Material Tracking Filter SKU';

  constructor(public readonly payload: { materialSKU: string }) { }
}

export class GetILTEventMaterialTrackingList {
  static readonly type = '[AP ILT Event Material Tracking] Get ILT Event Material Tracking List';
  constructor(public readonly payload: { eventId: string }) { }
}

export class ChangeILTEventMaterialTrackingListPaginationParams {
  static readonly type = '[AP ILT Event Material Tracking] Change ILT Event Material Tracking List Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetILTEventMaterialTrackingListState {
  static readonly type = '[AP ILT Event Material Tracking] Reset ILT Event Material Tracking List State';
}



