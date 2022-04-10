import {IPageable} from "../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetUnenrolledILTEventLearners {
  static readonly type = '[AP ILT Event Learners] Get Unenrolled ILT Event Learners';
  constructor(public readonly payload: { classEventId: string }) {}
}

export class ChangeUnenrolledILTEventLearnersPaginationParams {
  static readonly type = '[AP ILT Event Learners] Change Unenrolled ILT Event Learners Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetUnenrolledILTEventLearnersState {
  static readonly type = '[AP ILT Event Learners] Reset Unenrolled ILT Event Learners State';
}
