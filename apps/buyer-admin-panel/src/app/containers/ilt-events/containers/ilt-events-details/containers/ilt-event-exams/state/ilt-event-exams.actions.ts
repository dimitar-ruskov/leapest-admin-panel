import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class ChangeILTEventExamsFilterSKU {
  static readonly type = '[AP ILT Event Material Tracking] Change ILT Event Exams SKU';

  constructor(public readonly payload: { materialSKU: string }) { }
}

export class GetILTEventExams {
  static readonly type = '[AP ILT Event Material Tracking] Get ILT Event Exams';
  constructor(public readonly payload: { eventId: string }) { }
}

export class ChangeILTEventExamsPaginationParams {
  static readonly type = '[AP ILT Event Material Tracking] Change ILT Event Exams Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetILTEventExamsState {
  static readonly type = '[AP ILT Event Material Tracking] Reset ILT Event Exams State';
}



