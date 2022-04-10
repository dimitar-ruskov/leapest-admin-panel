import {IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  NotificationPayloadModel
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";

export class FetchEventDetailsILTNotifications {
  static readonly type = '[AP ILT Event Details] Fetch Event Details ILT Notifications';
  constructor(public readonly sku?: string) {}
}

export class ToggleSort {
  static readonly type = '[AP ILT Event Details] Toggle Sort';
  constructor(public readonly key?: string, public readonly direction?: number) {}
}

export class ChangePage {
  static readonly type = '[AP ILT Course Details] Change Page';
  constructor(public readonly payload: number) {}
}

export class GetNotificationDetails {
  static readonly type = '[AP ILT Event Details] Get Notification Details';
  constructor(
    public readonly eventSku: string,
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly venue: string,
  ) {}
}

export class GetNotificationRecipients {
  static readonly type = '[AP ILT Event Details] Get Notification Recipients';
  constructor(
    public readonly eventSku: string,
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly pageable?: IPageable,
  ) {}
}

export class TestEmail {
  static readonly type = '[AP ILT Event Details] Test Email Notification';
  constructor(public readonly trigger: string, public readonly recipient: string, public readonly venue: string) {}
}

export class ResetNotificationTemplate {
  static readonly type = '[AP ILT Event Details] Reset Notification Details';
  constructor(
    public readonly trigger: string,
    public readonly recipient: string,
    public readonly venue: string,
    public readonly level: string,
    public readonly eventSku: string,
  ) {}
}

export class PreviewNotificationTemplate {
  static readonly type = '[AP ILT Event Details] Preview Notification Template';
  constructor(public readonly data: NotificationPayloadModel, public readonly eventId?: string) {}
}

export class UpdateNotificationTemplate {
  static readonly type = '[AP ILT Event Details] Update Notification Details';
  constructor(public readonly data: NotificationPayloadModel) {}
}

export class ClearNotificationDetailsPartial {
  static readonly type = '[AP ILT Event Details] Clear Notification Details Partial';
  constructor() {}
}

export class ClearNotificationDetails {
  static readonly type = '[AP ILT Event Details] Clear Notification Details';
  constructor() {}
}

export class GetReportingManagerMapping {
  static readonly type = '[AP ILT Event Details] Get Reporting Manager Mapping';
  constructor() {}
}

export class ClearSearchForm {
  static readonly type = '[AP ILT Event Details] Clear Search Form';
  constructor() {}
}
