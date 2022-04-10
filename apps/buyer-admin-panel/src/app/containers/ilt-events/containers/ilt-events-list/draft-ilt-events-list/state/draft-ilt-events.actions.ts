import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetDraftILTEvents{
  static readonly type = '[AP ILT Events] Get Draft ILT Events';
}

export class ChangeDraftILTEventsPaginationParams {
  static readonly type = '[AP ILT Courses] Change Draft ILT Events Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetDraftILTEventsState {
  static readonly type = '[AP ILT Courses] Reset Draft ILT Events Page State';
}
