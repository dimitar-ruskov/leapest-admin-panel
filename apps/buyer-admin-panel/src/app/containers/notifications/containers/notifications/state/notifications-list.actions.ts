export class ToggleSort {
  static readonly type = '[AP Notifications] Toggle Sort';
  constructor(public readonly key?: string, public readonly direction?: number) {}
}

export class ChangePage {
  static readonly type = '[AP Notifications] Change Page';
  constructor(public readonly payload: number) {}
}

export class FetchNotifications {
  static readonly type = '[AP Notifications] Fetch Notifications';
  constructor() {}
}

export class ClearSearchForm {
  static readonly type = '[AP Notifications] Clear Search Form';
  constructor() {}
}
