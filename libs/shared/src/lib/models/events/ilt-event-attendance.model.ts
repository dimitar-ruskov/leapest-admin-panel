import { ILTEventLearner } from './ilt-event.model';

export enum BulkAttendanceTrackingCompletionTypeKeys {
  COURSE_COMPLETION = 'courseCompletion',
  DAILY_ATTENDANCE = 'dailyAttendance',
}

export type BulkAttendanceTrackingCompletionTypeKey =
  | BulkAttendanceTrackingCompletionTypeKeys.COURSE_COMPLETION
  | BulkAttendanceTrackingCompletionTypeKeys.DAILY_ATTENDANCE;

export enum IltEventAttendanceStatusKeys {
  NOT_SPECIFIED = 'not-specified',
  PRESENT = 'present',
  PARTIAL = 'partial',
  ABSENT = 'absent',
  INFORMED = 'informed',
}

export enum IltEventAttendanceStatusValues {
  NOT_SPECIFIED = 'Not Specified',
  PRESENT = 'Attended',
  PARTIAL = 'Partial',
  ABSENT = 'Absent',
  INFORMED = 'Informed',
}

export enum IltEventAttendanceStatusHints {
  NOT_SPECIFIED = 'Attendance not specified',
  PRESENT = 'Attended',
  PARTIAL = 'Partially Attended',
  ABSENT = 'Absent',
  INFORMED = 'Informed',
}

export type IltEventAttendanceStatusKey =
  | IltEventAttendanceStatusKeys.NOT_SPECIFIED
  | IltEventAttendanceStatusKeys.PRESENT
  | IltEventAttendanceStatusKeys.ABSENT
  | IltEventAttendanceStatusKeys.PARTIAL
  | IltEventAttendanceStatusKeys.INFORMED;

export type IltEventAttendanceStatusValue =
  | IltEventAttendanceStatusValues.NOT_SPECIFIED
  | IltEventAttendanceStatusValues.PRESENT
  | IltEventAttendanceStatusValues.ABSENT
  | IltEventAttendanceStatusValues.PARTIAL
  | IltEventAttendanceStatusKeys.INFORMED;

export interface ILTEventAttendanceStatus {
  id: string;
  configKey: IltEventAttendanceStatusKey;
  configType: 'learner-attendance-type';
  configValue: IltEventAttendanceStatusValue;
  createdAt: string;
  createdBy: string;
  systemConfig: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface ILTEventAttendance {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  user: ILTEventLearner;
  attendance: ILTEventAttendanceStatus;
  agendaItemId: string;
  classEventId: string;
  day: number;
  date: string;
  customAttendance: ILTEventCustomAttendance;
}

export interface ILTEventAttendancesByUser {
  attendances: ILTEventAttendance[];
  completed: boolean;
  user: ILTEventLearner;
}

export interface ILTEventAttendanceUpdatePayload {
  attendance: { configKey: IltEventAttendanceStatusKey; configType: 'learner-attendance-type' };
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  classEventId: string;
  agendaItemId: string;
  day: number;
}

export interface ILTEventAttendanceCompletionPayloadAttendance {
  learner: { username: string };
  completionPercentage: number;
}

export interface ILTEventAttendanceCompletionPayload {
  completionPercentage: number;
  attendances?: ILTEventAttendanceCompletionPayloadAttendance[];
  allUsers?: boolean;
}

export interface ILTEventBulkMarkAttendancesPayloadPayloadAttendance {
  configKey: IltEventAttendanceStatusKey;
  configType: 'learner-attendance-type';
}

export interface ILTEventBulkMarkAttendancesPayload {
  attendance: ILTEventBulkMarkAttendancesPayloadPayloadAttendance;
  classEventId: string;
  users: string[];
  days: number[];
  allUsers: boolean;
  onlyEmptyAttendance: boolean;
}

export interface ILTEventCustomAttendance {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  status: ILTEventAttendanceStatus;
  customAttendanceName: string;
  reason: string;
}

export interface ILTEventCustomAttendanceLight {
  status: IltEventAttendanceStatusValue;
  customAttendanceName: string;
  reason: string;
  reasonMandatory: boolean;
}
