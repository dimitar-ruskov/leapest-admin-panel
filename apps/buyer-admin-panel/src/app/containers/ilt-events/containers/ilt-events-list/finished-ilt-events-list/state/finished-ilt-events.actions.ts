import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models";

export class GetFinishedILTEvents {
  static readonly type = '[AP ILT Events] Get Finished ILT Events';
}

export class ChangeFinishedILTEventsPaginationParams {
  static readonly type = '[AP ILT Courses] Change Finished ILT Events Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetFinishedILTEventsState {
  static readonly type = '[AP ILT Courses] Reset Finished ILT Events Page State';
}
