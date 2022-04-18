import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class GetSPCourseLanguageVariants {
  static readonly type = '[AP Self-paced Course Details] Get Active Self-paced Course Language Variants';

  constructor(public readonly payload: { id: string }) {}
}

export class ChangeSPCourseLanguageVariantsPaginationParams {
  static readonly type = '[AP Self-paced Course Details] Change SPCourse Language Variants Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetSPCourseLanguageVariantsState {
  static readonly type = '[AP Self-paced Course Details] Reset SPCourse Language Variants State';
}
