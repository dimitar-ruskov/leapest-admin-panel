import {
  ExportLearnersDto,
  IPageable
} from "../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetSPCourseLanguageVariantLearnersPending {
  static readonly type = '[AP Self-paced Course Details] Get Unapproved Self-paced Course Language Variant Learners';

  constructor(public readonly payload: { id: string }) {}
}

export class ChangeSPCourseLanguageVariantLearnersPendingPaginationParams {
  static readonly type =
    '[AP Self-paced Course Details] Change Unapproved Self-paced Course Language Variant Learners Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ChangeSPCourseLanguageVariantLearnersPendingPage {
  static readonly type =
    '[AP Self-paced Course Details] Change Unapproved Self-paced Course Language Variant Learners Page';

  constructor(public readonly payload: { page: number }) {}
}

export class SpliceSPCourseLanguageVariantLearnersPending {
  static readonly type =
    '[AP Self-paced Course Details] Splice Self-paced Course Language Variant Learners Waiting For Approval';

  constructor(public readonly payload: { learnerUserNames: string[] }) {}
}

export class ExportLearnerFromEvent {
  static readonly type = '[AP Self-paced Course Details] Export Learner From ILT Event';
  constructor(public readonly payload: ExportLearnersDto) {}
}
