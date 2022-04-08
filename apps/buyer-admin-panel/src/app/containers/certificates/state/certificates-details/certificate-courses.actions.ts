import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetCertificateCourses {
  static readonly type = '[Certificate Courses] Get Certificate Courses';
  constructor(public readonly payload: { certificateId: string }) {}
}

export class ChangeCertCoursesPaginationParams {
  static readonly type = '[Certificate Courses] Change Certificate Courses Pagination Params';
  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetCertificateCoursesState {
  static readonly type = '[Certificate Courses] Reset Certificate Courses State';
}
