import {ILTEventLearner, IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class GetWaitingList {
  static readonly type = '[AP Waiting List] Get Waiting List';
  constructor(public readonly payload: { classEventId: string }) {}
}

export class ChangeWaitingListPaginationParams {
  static readonly type = '[AP Waiting List] Change Waiting List Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetWaitingListState {
  static readonly type = '[AP Waiting List] Reset Waiting List State';
}

export class PromoteWaitingListLearner {
  static readonly type = '[AP Waiting List] Promote Waiting List Learner';
  constructor(public readonly eventId: string, public readonly data: { username: string }) {}
}

export class DemoteWaitingListLearner {
  static readonly type = '[AP Waiting List] Demote Waiting List Learner';
  constructor(public readonly eventId: string, public readonly data: { username: string }) {}
}

export class AddWaitingListLearners {
  static readonly type = '[AP Waiting List] Add Waiting List Learner';
  constructor(public readonly classEventId: string, public readonly learners: string[]) {}
}

export class RemoveWaitingListLearners {
  static readonly type = '[AP Waiting List] Remove Waiting List Learner';
  constructor(public readonly classEventId: string, public readonly learners: ILTEventLearner[]) {}
}
