export enum SPCourseCreationSteps {
  MATERIALS = 'materials',
  DETAILS = 'details',
  SUMMARY = 'summary'
}

export const SPCourseCreationStepsList = [
  SPCourseCreationSteps.MATERIALS,
  SPCourseCreationSteps.DETAILS,
  SPCourseCreationSteps.SUMMARY
];

export type SPCourseCreationStep =
  SPCourseCreationSteps.MATERIALS |
  SPCourseCreationSteps.DETAILS |
  SPCourseCreationSteps.SUMMARY;
