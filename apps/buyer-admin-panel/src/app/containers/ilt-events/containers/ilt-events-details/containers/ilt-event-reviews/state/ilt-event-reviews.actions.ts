import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetCourseEventReviews {
  static readonly type = '[AP Event Reviews] Get Course Event Reviews';
  constructor(public readonly eventId: string) { }
}

export class ResetEventReviewsListState {
  static readonly type = '[AP Event Reviews] Reset Event Reviews List State';
}

export class ChangeEventReviewsPaginationParams {
  static readonly type = '[AP Event Reviews] Change Event Reviews Pagination Params';
  constructor(public readonly payload: { pageable: IPageable }) {
  }
}
export class DeleteCourseEventReview {
  static readonly type = '[AP Event Reviews] Delete Course Event Review';
  constructor(public readonly payload: { id: string, eventId: string }) {
  }
}
