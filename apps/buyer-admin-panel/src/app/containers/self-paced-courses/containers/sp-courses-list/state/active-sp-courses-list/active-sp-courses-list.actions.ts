import {IPageable} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetActiveSelfPacedCourses {
  static readonly type = '[AP Self-paced Courses] Get Active Self-paced Courses';
}

export class ChangeActiveSPCoursesPaginationParams {
  static readonly type = '[AP Self-paced Courses] Change Active Self-paced Courses Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {
  }
}

export class ResetActiveSPCoursesState {
  static readonly type = '[AP Self-paced Courses] Reset Active Self-paced Courses Page State';
}
