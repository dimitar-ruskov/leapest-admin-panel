import {
  PreSPCourseLanguageVariant,
  PreSPCourseLanguageVariantCreatePayload
} from '../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course-language-variant.model';
import { SPCourseLanguageVariantCreationStep } from '../../../../../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course-create-variant-step.model';

export class CreatePreSPCourseLanguageVariant {
  static readonly type = '[AP Self-paced Courses] Create Pre Self-paced Course Language Variant';

  constructor(public readonly payload: {
    preSPCourseLanguageVariant: PreSPCourseLanguageVariantCreatePayload,
    courseId: string
  }) {
  }
}

export class GetPreSPCourseLanguageVariant {
  static readonly type = '[AP Self-paced Courses] Get Pre Self-paced Course Language Variant';

  constructor(public readonly payload: {id: string}) {
  }
}

export class GoToSPCourseLanguageVariantCreationStep {
  static readonly type = '[AP Self-paced Courses] Go to Self-paced Course Language Variant Creation Step';

  constructor(public readonly payload: {step: SPCourseLanguageVariantCreationStep}) {
  }
}

export class UpdatePreSPCourseLanguageVariant {
  static readonly type = '[AP Self-paced Courses] Update Pre Self-paced Course Language Variant';

  constructor(public readonly payload: {
    updatedPreSPCourseLanguageVariant: PreSPCourseLanguageVariant,
    step: SPCourseLanguageVariantCreationStep
  }) {
  }
}
