import {
  IKeyValuePair,
  ILTEvent,
  ILTEventAttendanceCompletionPayload,
  ILTEventAttendanceUpdatePayload,
  ILTEventBulkMarkAttendancesPayload,
  ILTEventLearner,
  S3BucketData
} from "../../../../../../../../../libs/shared/src/lib/models";


export class GetCompleteILTEventDetails {
  static readonly type = '[AP ILT Event Details] Get Complete ILT Event Details';

  constructor(public readonly sku: string) {}
}

export class RemoveLearnerFromILTEvent {
  static readonly type = '[AP ILT Event Details] Remove Learner From ILT Event';

  constructor(public readonly eventId: string, public readonly data: string[]) {}
}

export class RejectLearnerRegistrationRequest {
  static readonly type = '[AP ILT Event Details] Reject Learner Registration Request';

  constructor(public readonly data: { username: string; courseEventId: string; message: string }) {}
}

export class ApproveLearnerRegistrationRequest {
  static readonly type = '[AP ILT Event Details] Approve Learner Registration Request';

  constructor(public readonly data: { username: string; courseEventId: string }) {}
}

export class UploadLearnersFromCSVToILTEvent {
  static readonly type = '[AP ILT Event Details] Upload Learners From CSV To ILT Event';

  constructor(public readonly eventId: string, public readonly data: ILTEventLearner[]) {}
}

export class AssignLearnersToILTEvent {
  static readonly type = '[AP ILT Event Details] Assign Learners To ILT Event';

  constructor(public readonly eventId: string, public readonly data: string[]) {}
}

export class GenerateEventThumbnail {
  static readonly type = '[AP ILT Event Details] Generate Event Thumbnail';

  constructor(public readonly data: { id: string }) {}
}

export class UploadEventThumbnail {
  static readonly type = '[AP ILT Event Details] Upload Event Thumbnail';

  constructor(public readonly data: { courseId: string; s3BucketData: S3BucketData }) {}
}

export class UpdateILTEventAttribute {
  static readonly type = '[AP ILT Event Details] Update ILT Event Attribute';

  constructor(
    public readonly payload: {
      updatedILTEvent: ILTEvent;
      attribute: string;
      props?: string[];
    },
  ) {}
}

export class UpdateILTEventAgenda {
  static readonly type = '[AP ILT Event Details] Update ILT Event Agenda';

  constructor(public readonly data: ILTEvent, public readonly key: string) {}
}

export class DiscardILTEventAgendaChanges {
  static readonly type = '[AP ILT Event Details] Discard ILT Event Agenda Changes';
}

export class GetILTEventAttendancesByUsers {
  static readonly type = '[AP ILT Event Details] Get List Of Attendances Grouped By Users';

  constructor(public readonly eventSku: string) {}
}

export class ChangeILTEventAttendancesPage {
  static readonly type = '[AP ILT Event Details] Change ILT Event Attendances Page';

  constructor(public readonly payload: number) {}
}

export class ChangeILTEventAttendancesFilter {
  static readonly type = '[AP ILT Event Details] Change ILT Events Attendances Filter';

  constructor(public readonly payload: string) {}
}

export class ChangeILTEventAttendancesSort {
  static readonly type = '[AP ILT Event Details] Change ILT Event Attendances Sort';

  constructor(public readonly payload: IKeyValuePair) {}
}

export class UpdateILTEventAttendance {
  static readonly type = '[AP ILT Event Details] Update ILT Event Attendance For User';

  constructor(
    public readonly payload: {
      eventId: string;
      data: ILTEventAttendanceUpdatePayload;
    },
  ) {}
}

export class CompleteILTEventAttendance {
  static readonly type = '[AP ILT Event Details] Complete ILT Event Attendance For User';

  constructor(
    public readonly payload: {
      eventId: string;
      data: ILTEventAttendanceCompletionPayload;
    },
  ) {}
}

export class BulkCompleteILTEventAttendances {
  static readonly type = '[AP ILT Event Details] Complete ILT Event Attendances For Users In Bulk';

  constructor(
    public readonly payload: {
      eventId: string;
      data: ILTEventAttendanceCompletionPayload;
    },
  ) {}
}

export class BulkMarkILTEventAttendances {
  static readonly type = '[AP ILT Event Details] Mark ILT Event Attendances For Users In Bulk';

  constructor(
    public readonly payload: {
      eventId: string;
      data: ILTEventBulkMarkAttendancesPayload;
    },
  ) {}
}

export class EnableWaitingList {
  static readonly type = '[AP ILT Event Details] Enable Waiting List';

  constructor(
    public readonly payload: {
      eventId: string;
      data: { capacity: number };
    },
  ) {}
}

export class DisableWaitingList {
  static readonly type = '[AP ILT Event Details] Disable Waiting List';

  constructor(
    public readonly payload: {
      eventId: string;
    },
  ) {}
}

export class UnmarkCompletion {
  static readonly type = '[AP ILT Event Details] Unmark Completion';

  constructor(
    public readonly payload: {
      eventId: string;
      data: ILTEventAttendanceCompletionPayload;
    },
  ) {}
}

export class ExportLearnerFromILTEvent {
  static readonly type = '[AP ILT Event Details] Export Learner From ILT Event';
  constructor(public readonly payload: { classEventId: string; csvType: string; statuses: string[] }) {}
}
