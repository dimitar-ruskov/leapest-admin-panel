import {
  NotificationPayloadModel
} from "../../../../../../../../../libs/shared/src/lib/models";

export class GetNotificationDetails {
  static readonly type = '[AP Notifications] Get Notification Details';

  constructor(public readonly trigger: string, public readonly recipient: string, public readonly venue: string) {}
}

export class ClearNotificationDetailsPartial {
  static readonly type = '[AP Notifications] Clear Notification Details Partial';
  constructor() {}
}

export class ClearNotificationDetails {
  static readonly type = '[AP Notifications] Clear Notification Details';
  constructor() {}
}

export class PreviewNotificationTemplate {
  static readonly type = '[AP Notifications] Preview Notification Template';
  constructor(public readonly data: NotificationPayloadModel) {}
}

export class UpdateNotificationTemplate {
  static readonly type = '[AP Notifications] Update Notification Details';
  constructor(public readonly data: NotificationPayloadModel) {}
}

export class ResetNotificationTemplate {
  static readonly type = '[AP Notifications] Reset Notification Details';
  constructor(
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly venue: string,
    public readonly hardReset?: boolean,
  ) {}
}

export class TestEmail {
  static readonly type = '[AP Notifications] Test Email Notification';
  constructor(public readonly trigger: string, public readonly recipient: string, public readonly venue: string) {}
}

export class GetReportingManagerMapping {
  static readonly type = '[AP Notifications] Get Reporting Manager Mapping';
  constructor() {}
}
