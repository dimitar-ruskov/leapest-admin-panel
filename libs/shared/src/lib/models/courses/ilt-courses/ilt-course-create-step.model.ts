export enum ILTCourseCreationStep {
  MATERIALS = 'materials',
  DETAILS = 'details',
  AGENDA = 'agenda',
  SUMMARY = 'summary'
}

export const ILT_COURSE_CREATION_STEPS_LIST = [
  ILTCourseCreationStep.MATERIALS,
  ILTCourseCreationStep.DETAILS,
  ILTCourseCreationStep.AGENDA,
  ILTCourseCreationStep.SUMMARY
];

export type ILTCourseCreationStepType =
  ILTCourseCreationStep.MATERIALS |
  ILTCourseCreationStep.DETAILS |
  ILTCourseCreationStep.AGENDA |
  ILTCourseCreationStep.SUMMARY;
