import {IPageable} from "../../../../../../../../../../../../libs/shared/src/lib/models";

export class GetEnrolledILTEventLearners {
  static readonly type = '[AP ILT Event Learners] Get Enrolled ILT Event Learners';
  constructor(public readonly payload: { classEventId: string }) { }
}

export class ChangeEnrolledILTEventLearnersPaginationParams {
  static readonly type = '[AP ILT Event Learners] Change Enrolled ILT Event Learners Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetEnrolledILTEventLearnersState {
  static readonly type = '[AP ILT Event Learners] Reset Enrolled ILT Event Learners State';
}



