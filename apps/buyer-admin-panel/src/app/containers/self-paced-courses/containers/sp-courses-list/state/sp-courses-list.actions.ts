import { PreSelfPacedCourse } from '../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';

export class ChangeSelfPacedCoursesListTab {
  static readonly type = '[AP Self-paced Courses] Change Self-paced Courses List Tab';
  constructor(public readonly payload: { activeTab: number }) { }
}

export class GetFullLanguageDictionary {
  static readonly type = '[AP Self-paced Courses] Get Full Language Dictionary';
}

export class CreatePreSelfPacedCourse {
  static readonly type = '[AP Self-paced Courses] Create Draft Self-paced Course';

  constructor(public readonly payload: {updatedCourse: Partial<PreSelfPacedCourse>}) {
  }
}
