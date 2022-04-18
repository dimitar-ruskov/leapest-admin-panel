import {
  NotificationPayloadModel
} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class FetchCourseDetailsILTNotifications {
  static readonly type = '[AP ILT Course Details] Fetch Course Details ILT Notifications';
  constructor(public readonly id?: string) {}
}

export class ToggleSort {
  static readonly type = '[AP ILT Course Details] Toggle Sort';
  constructor(public readonly key?: string, public readonly direction?: number) {}
}

export class ChangePage {
  static readonly type = '[AP ILT Course Details] Change Page';
  constructor(public readonly payload: number) {}
}

export class GetNotificationDetails {
  static readonly type = '[AP ILT Course Details] Get Notification Details';
  constructor(
    public readonly courseId: string,
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly venue: string,
  ) {}
}

export class TestEmail {
  static readonly type = '[AP ILT Course Details] Test Email Notification';
  constructor(
    public readonly courseId: string,
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly venue: string,
  ) {}
}

export class ResetNotificationTemplate {
  static readonly type = '[AP ILT Course Details] Reset Notification Details';
  constructor(
    public readonly courseId: string,
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly venue: string,
    public readonly level: string,
  ) {}
}

export class PreviewNotificationTemplate {
  static readonly type = '[AP ILT Course Details] Preview Notification Template';
  constructor(public readonly courseId: string, public readonly data: NotificationPayloadModel) {}
}

export class UpdateNotificationTemplate {
  static readonly type = '[AP ILT Course Details] Update Notification Details';
  constructor(public readonly courseId: string, public readonly data: NotificationPayloadModel) {}
}

export class ClearNotificationDetailsPartial {
  static readonly type = '[AP ILT Course Details] Clear Notification Details Partial';
  constructor() {}
}

export class ClearNotificationDetails {
  static readonly type = '[AP ILT Course Details] Clear Notification Details';
  constructor() {}
}

export class GetReportingManagerMapping {
  static readonly type = '[AP ILT Course Details] Get Reporting Manager Mapping';
  constructor() {}
}

export class ClearSearchForm {
  static readonly type = '[AP ILT Course Details] Clear Search Form';
  constructor() {}
}
