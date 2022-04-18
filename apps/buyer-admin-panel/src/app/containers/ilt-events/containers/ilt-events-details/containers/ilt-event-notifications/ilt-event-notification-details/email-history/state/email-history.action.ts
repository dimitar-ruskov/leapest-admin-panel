import {
  IPageableEmailHistory
} from "../../../../../../../../../../../../../libs/shared/src/lib/models/notifications/email-history.model";

export class GetEmailHistory {
  static readonly type = '[AP Email History] Get Email History';
  constructor(public readonly payload: { classEventId: string }) {}
}

export class ChangeEmailHistoryPaginationParams {
  static readonly type = '[AP Email History] Change Email History Pagination Params';
  constructor(public readonly payload: { pageable: IPageableEmailHistory }) {}
}

export class PreviewNotificationHistoryTemplate {
  static readonly type = '[AP Email History] Preview Notification History Template';
  constructor(public readonly hedwigEmailId: string) {}
}
