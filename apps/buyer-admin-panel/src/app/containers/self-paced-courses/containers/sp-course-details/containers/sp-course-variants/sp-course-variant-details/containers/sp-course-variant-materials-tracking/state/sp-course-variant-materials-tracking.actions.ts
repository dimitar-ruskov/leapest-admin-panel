export class ChangeSPCourseLanguageVariantMaterialSKU {
  static readonly type = '[AP Self-paced Course Details] Change Selected Self-paced Course Language Variant Material SKU';

  constructor(public readonly payload: { materialSKU: string }) { }
}

export class GetSPCourseLanguageVariantMaterialsTrackingList {
  static readonly type = '[AP Self-paced Course Details] Get Self-paced Course Language Variant Materials Tracking List';
  constructor(public readonly payload: { id: string }) { }
}

export class ChangeSPCourseLanguageVariantMaterialsTrackingPage {
  static readonly type = '[AP Self-paced Course Details] Change Self-paced Course Language Variant Materials Tracking Page';

  constructor(public readonly payload: { page: number }) {
  }
}
