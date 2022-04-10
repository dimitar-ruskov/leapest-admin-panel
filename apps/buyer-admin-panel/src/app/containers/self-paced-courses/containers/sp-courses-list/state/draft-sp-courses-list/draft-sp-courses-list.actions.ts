import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetDraftSelfPacedCourses {
  static readonly type = '[AP Self-paced Courses] Get Draft Self-paced Courses';
}

export class DeleteDraftSPCourse {
  static readonly type = '[AP Self-paced Courses] Delete Draft Self-paced Course';

  constructor(public readonly payload: { id: string }) {
  }
}

export class ChangeDraftSPCoursesPaginationParams {
  static readonly type = '[AP Self-paced Courses] Change Draft Self-paced Courses Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetDraftSPCoursesState {
  static readonly type = '[AP Self-paced Courses] Reset Draft Self-paced Courses State';
}
