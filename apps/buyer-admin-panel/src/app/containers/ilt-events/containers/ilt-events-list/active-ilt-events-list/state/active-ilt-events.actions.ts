import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models";

export class GetActiveILTEvents {
  static readonly type = '[AP ILT Events] Get Active ILT Events';
}

export class ChangeActiveILTEventsPaginationParams {
  static readonly type = '[AP ILT Events] Change Active ILT Events Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetActiveILTEventsState {
  static readonly type = '[AP ILT Events] Reset Active ILT Events Page State';
}

export class CancelILTEvent {
  static readonly type = '[AP ILT Events] Cancel ILT Event';

  constructor(public readonly payload: { eventId: string; cancelReason: string }) {}
}
