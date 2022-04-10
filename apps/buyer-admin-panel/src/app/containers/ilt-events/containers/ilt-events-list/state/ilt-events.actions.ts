export class ChangeILTEventsListTab {
  static readonly type = '[AP Ilt Events] Change ILT Events List Tab';
  constructor(public readonly payload: { activeTab: number }) { }
}
