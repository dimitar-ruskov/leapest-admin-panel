import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class GetCourseReviews {
    static readonly type = '[AP Course Reviews] Get Course Reviews';
    constructor(public readonly courseId: string) { }
  }

  export class ChangeCourseReviewsPaginationParams {
    static readonly type = '[AP Course Reviews] Change Course Reviews List Pagination Params';
    constructor(public readonly payload: { pageable: IPageable }) {
    }
  }

  export class ResetCourseReviewsListState {
    static readonly type = '[AP Course Reviews] Reset Course Reviews List State';
  }

  export class DeleteCourseReview {
    static readonly type = '[AP Course Reviews] Delete Course Review';
    constructor(public readonly payload: { id: string, courseEventId: string }) {
    }
  }
