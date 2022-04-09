export class GetNotificationsSettings {
  static readonly type = '[Notifications Settings] Get Notifications Settings';
  constructor() {}
}

export class UpdateNotificationsLogo {
  static readonly type = '[Notifications Settings] Update Notifications Logo';
  constructor(public readonly payload: { notificationLogoBucket: string; notificationLogoKey: string }) {}
}
