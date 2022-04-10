import { SPCourseLanguageVariant } from '../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import { SPCourseLanguageVariantLearner } from '../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course-language-variant-learner.model';
import {S3BucketData} from "../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class ChangeSPCourseLanguageVariantDetailsTab {
  static readonly type = '[AP Self-paced Course Details] Change Self-paced Course Language Variant Details Tab';
  constructor(public readonly payload: { activeTab: number }) { }
}

export class GetSPCourseLanguageVariant {
  static readonly type = '[AP Self-paced Course Details] Get Self-paced Course Language Variant';
  constructor(public readonly payload: { id: string }) { }
}

export class UpdateSPCourseLanguageVariantAttribute {
  static readonly type = '[AP Self-paced Course Details] Update Self-paced Course Language Variant Attribute';
  constructor(public readonly payload: {
    updatedLanguageVariant: SPCourseLanguageVariant,
    attribute: string,
    props?: string[]
  }) { }
}

export class GenerateSPCourseLanguageVariantThumbnail {
  static readonly type = '[AP Self-paced Course Details] Generate Self-paced Course Language Variant Thumbnail';
  constructor(public readonly payload: { courseId: string }) { }
}

export class UploadSPCourseLanguageVariantThumbnail {
  static readonly type = '[AP Self-paced Course Details] Upload Self-paced Course Language Variant Thumbnail';
  constructor(public readonly payload: { courseId: string, s3BucketData: S3BucketData }) { }
}

export class AssignLearnersToLanguageVariant {
  static readonly type = '[AP Self-paced Course Details] Assign Learners To Self-paced Course Language Variant';
  constructor(public readonly payload: {languageVariantId: string, data: string[]}) { }
}

export class UploadLearnersFromCSVToLanguageVariant {
  static readonly type = '[AP Self-paced Course Details] Upload Learners From CSV To Self-paced Course Language Variant';
  constructor(public readonly payload: {languageVariantId: string, data: SPCourseLanguageVariantLearner[]}) { }
}

export class RemoveSPCourseLanguageVariantLearner {
  static readonly type = '[AP Self-paced Course Details] Remove Learner From Self-paced Course Language Variant';

  constructor(public readonly payload: { id: string, learners: string[] }) {
  }
}

export class RejectSPCourseLanguageVariantLearnerRegistrationRequest {
  static readonly type = '[AP Self-paced Course Details] Reject SP Course Language Variant Learner Registration Request';
  constructor(public readonly payload: { username: string, courseEventId: string, message: string }) { }
}

export class ApproveSPCourseLanguageVariantLearnerRegistrationRequest {
  static readonly type = '[AP Self-paced Course Details] Approve SP Course Language Variant Learner Registration Request';
  constructor(public readonly payload: { username: string, courseEventId: string }) { }
}
