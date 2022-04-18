import { ILTCourseCreationStepType } from '../../../../../../../../../libs/shared/src/lib/models/courses/ilt-courses/ilt-course-create-step.model';
import {PreILTCourse} from "../../../../../../../../../libs/shared/src/lib/models";

export class GetPreILTCourse {
  static readonly type = '[AP ILT Courses] Get Draft ILT Course Details';

  constructor(public readonly payload: { id: string }) {}
}

export class CancelILTCourseCreation {
  static readonly type = '[AP ILT Courses] Cancel ILT Course Creation';
}

export class GoToILTCourseCreationStep {
  static readonly type = '[AP ILT Courses] Go to ILT Course Creation Step';

  constructor(public readonly payload: { step: ILTCourseCreationStepType }) {}
}

export class UpdatePreILTCourse {
  static readonly type = '[AP ILT Courses] Update Draft ILT Course Details';
  constructor(
    public readonly payload: {
      updatedCourse: Partial<PreILTCourse>;
      step: ILTCourseCreationStepType;
    },
  ) {}
}
