import {
  ExportLearnersDto,
  IPageable
} from "../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetSPCourseLanguageVariantLearnersEnrolled {
  static readonly type = '[AP Self-paced Course Details] Get Enrolled Self-paced Course Language Variant Learners';

  constructor(public readonly payload: { id: string }) {}
}

export class ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams {
  static readonly type =
    '[AP Self-paced Course Details] Change Enrolled Self-paced Course Language Variant Learners Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ChangeSPCourseLanguageVariantLearnersEnrolledPage {
  static readonly type =
    '[AP Self-paced Course Details] Change Enrolled Self-paced Course Language Variant Learners Page';

  constructor(public readonly payload: { page: number }) {}
}

export class SpliceSPCourseLanguageVariantLearnersEnrolled {
  static readonly type = '[AP Self-paced Course Details] Splice Enrolled Self-paced Course Language Variant Learners';

  constructor(public readonly payload: { learnerUserNames: string[] }) {}
}

export class ExportLearnerFromSPCourseLanguageVariantLearnersEnrolled {
  static readonly type =
    '[AP Self-paced Course Details] Export Learner From Self-paced Course Language Variant Learners Enrolled';

  constructor(public readonly payload: ExportLearnersDto) {}
}
