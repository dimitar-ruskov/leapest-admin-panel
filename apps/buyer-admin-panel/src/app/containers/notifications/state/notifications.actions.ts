export class ChangeNotificationsTab {
  static readonly type = '[AP Notifications] Change Notifications Tab';
  constructor(public readonly payload: { activeTab: number }) {}
}
