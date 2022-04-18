import { InstructorLite, IPageable } from "../../../../../../../../../libs/shared/src/lib/models";

export class GetInstructor {
  static readonly type = '[AP Instructor Details] Get Instructor Details';
  constructor(public readonly payload: { id: string }) {}
}

export class GetEvents {
  static readonly type = '[AP Instructor Details] Get Events List';
  constructor(public readonly payload: { id: string; state: string }) {}
}

export class UpdateInstructor {
  static readonly type = '[AP Instructor Details] Update Instructor';
  constructor(public readonly payload: { instructor: InstructorLite }) {}
}

export class ChangeInstructorDetailsPaginationParams {
  static readonly type = '[AP Instructor Details] Change Instructor Details Pagination Params';
  constructor(public readonly payload: { pageable: IPageable }) {}
}
export class ResetInstructorDetailsState {
  static readonly type = '[AP Instructor Details] Reset Instructor Details State';
}
