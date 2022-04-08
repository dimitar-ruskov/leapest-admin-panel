import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetInstructors {
  static readonly type = '[AP Instructors List] Get Instructors';
}

export class ChangeInstructorsPaginationParams {
  static readonly type = '[AP Instructors List] Change Instructors Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetInstructorsState {
  static readonly type = '[AP Instructors List] Reset Instructors State';
}
