import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

import { NotificationsListState } from "../containers/notifications/state/notifications-list.state";
import { NotificationsSettingsState } from "../containers/notifications/state/notifications-settings.state";
import { NotificationDetailsState } from "../containers/notification-details/state/notification-details.state";
import { ChangeNotificationsTab } from "./notifications.actions";

export class NotificationsStateModel {
  activeTab: number;
}

@State<NotificationsStateModel>({
  name: 'notifications',
  defaults: {
    activeTab: 0,
  },
  children: [NotificationsSettingsState, NotificationsListState, NotificationDetailsState],
})
@Injectable()
export class NotificationsState {
  @Selector([NotificationsState])
  static activeTab(state: NotificationsStateModel) {
    return state.activeTab;
  }

  constructor() {}

  @Action(ChangeNotificationsTab)
  changeNotificationsTab(
    { patchState, getState, dispatch }: StateContext<NotificationsStateModel>,
    { payload: { activeTab } }: ChangeNotificationsTab,
  ) {
    patchState({ activeTab });
  }
}
