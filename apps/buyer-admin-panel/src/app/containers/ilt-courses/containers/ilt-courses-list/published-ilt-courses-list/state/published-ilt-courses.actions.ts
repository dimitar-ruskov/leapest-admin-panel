import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models";

export class GetPublishedILTCourses {
  static readonly type = '[AP ILT Courses] Get Published ILT Courses';
}

export class ChangePublishedILTCoursesPaginationParams {
  static readonly type = '[AP ILT Courses] Change Published ILT Courses Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetPublishedILTCoursesState {
  static readonly type = '[AP ILT Courses] Reset Published ILT Courses Page State';
}
