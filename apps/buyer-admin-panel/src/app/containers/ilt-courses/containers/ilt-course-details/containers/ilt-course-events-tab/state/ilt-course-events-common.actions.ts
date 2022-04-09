import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetAllEventsByType {
  static readonly type = '[AP Course Events] Get All Events for Course By Type';
  constructor(public readonly payload: { status: string; parentId: string }) {}
}

export class ChangeEventsPaginationParams {
  static readonly type = '[AP Course Events ] Change Course Events Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetCourseEventsState {
  static readonly type = '[AP Course Events] Reset Course Events Page State';
}

export class CancelCourseEvent {
  static readonly type = '[AP Course Events] Cancel Course Event';
  constructor(public readonly payload: { eventId: string; cancelReason: string }) {}
}
