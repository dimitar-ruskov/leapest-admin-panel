export enum SPCourseLanguageVariantCreationSteps {
  MATERIALS = 'materials',
  DETAILS = 'details',
  SUMMARY = 'summary'
}

export const SPCourseLanguageVariantCreationStepsList = [
  SPCourseLanguageVariantCreationSteps.MATERIALS,
  SPCourseLanguageVariantCreationSteps.DETAILS,
  SPCourseLanguageVariantCreationSteps.SUMMARY
];

export type SPCourseLanguageVariantCreationStep =
  SPCourseLanguageVariantCreationSteps.MATERIALS |
  SPCourseLanguageVariantCreationSteps.DETAILS |
  SPCourseLanguageVariantCreationSteps.SUMMARY;
