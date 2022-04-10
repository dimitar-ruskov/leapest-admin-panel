import {IPageable} from "../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetPendingILTEventLearners {
  static readonly type = '[AP ILT Event Learners] Get Pending ILT Event Learners';
  constructor(public readonly payload: { classEventId: string }) { }
}

export class ChangePendingILTEventLearnersPaginationParams {
  static readonly type = '[AP ILT Event Learners] Change Pending ILT Event Learners Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetPendingILTEventLearnersState {
  static readonly type = '[AP ILT Event Learners] Reset Pending ILT Event Learners State';
}
