import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models";

export class GetDraftILTCourses {
  static readonly type = '[AP ILT Courses] Get Draft ILT Courses';
}

export class DeleteDraftILTCourse {
  static readonly type = '[AP ILT Courses] Delete Draft ILT Course';

  constructor(public readonly payload: { id: string }) {
  }
}

export class ChangeDraftILTCoursesPaginationParams {
  static readonly type = '[AP ILT Courses] Change Draft ILT Courses Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetDraftILTCoursesState {
  static readonly type = '[AP ILT Courses] Reset Draft ILT Courses Page State';
}
