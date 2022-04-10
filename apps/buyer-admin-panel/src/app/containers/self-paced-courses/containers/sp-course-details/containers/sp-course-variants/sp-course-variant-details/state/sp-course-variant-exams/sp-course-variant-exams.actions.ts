export class GetSPCourseLanguageVariantExams {
  static readonly type = '[AP Self-paced Course Details] Get Self-paced Course Language Variant Exams';

  constructor(public readonly payload: { id: string, examVariantSKU?: string }) { }
}

export class ChangeSPCourseLanguageVariantExamSKU {
  static readonly type = '[AP Self-paced Course Details] Change Selected Self-paced Course Language Variant Exam SKU';

  constructor(public readonly payload: { examVariantSKU: string }) { }
}

export class ChangeSPCourseLanguageVariantExamsPage {
  static readonly type = '[AP Self-paced Course Details] Change Self-paced Course Language Variant Exams Page';

  constructor(public readonly payload: { page: number }) {
  }
}
