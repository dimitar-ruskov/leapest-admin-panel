import {ILTEventBase, PreILTCourse} from "../../../../../../../../../libs/shared/src/lib/models";

export class ChangeILTCoursesListTab {
  static readonly type = '[AP ILT Courses] Change ILT Courses List Tab';
  constructor(public readonly payload: { activeTab: number }) { }
}

export class CreatePreILTCourse {
  static readonly type = '[AP ILT Courses] Create Draft ILT Course';

  constructor(public readonly payload: {updatedCourse: Partial<PreILTCourse>}) {
  }
}

export class ScheduleILTCourseEvent {
  static readonly type = '[AP ILT Courses] Schedule New ILT Course Event';

  constructor(public readonly payload: { preCourseEvent: Partial<ILTEventBase> }) {
  }
}
