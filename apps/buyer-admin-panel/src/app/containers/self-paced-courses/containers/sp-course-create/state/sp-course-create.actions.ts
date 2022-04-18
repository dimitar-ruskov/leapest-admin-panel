import { PreSelfPacedCourse, SPCourseCreationStep } from "../../../../../../../../../libs/shared/src/lib/models";

export class GetPreSelfPacedCourse {
  static readonly type = '[AP Self-paced Courses] Get Draft Self-paced Course Details';

  constructor(public readonly payload: {id: string}) {
  }
}

export class CancelSPCourseCreation {
  static readonly type = '[AP Self-paced Courses] Cancel Course Creation';
}

export class GoToSPCourseCreationStep {
  static readonly type = '[AP Self-paced Courses] Go to Self-paced Course Creation Step';

  constructor(public readonly payload: {step: SPCourseCreationStep}) {
  }
}

export class UpdatePreSelfPacedCourse {
  static readonly type = '[AP Self-paced Courses] Update Draft Self-paced Course Details';

  constructor(public readonly payload: {
    updatedCourse: Partial<PreSelfPacedCourse>,
    step: SPCourseCreationStep
  }) {
  }
}
