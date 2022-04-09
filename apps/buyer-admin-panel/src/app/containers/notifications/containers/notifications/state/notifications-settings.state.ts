import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { NotificationsService } from '../../../service/notifications.service';
import { GetNotificationsSettings, UpdateNotificationsLogo } from './notifications-settings.action';

import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationPlaceholderModel
} from "../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";

export class NotificationsSettingsStateModel {
  notificationLogoBucket: string;
  notificationLogoKey: string;
  emailSender: string;
  senderName: string;
  customValuePlaceholders: NotificationPlaceholderModel[];
  footer: string;
}

@State<NotificationsSettingsStateModel>({
  name: 'notificationsSettings',
  defaults: {
    notificationLogoBucket: undefined,
    notificationLogoKey: undefined,
    emailSender: undefined,
    senderName: undefined,
    customValuePlaceholders: undefined,
    footer: undefined,
  },
})
@Injectable()
export class NotificationsSettingsState {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Action(GetNotificationsSettings)
  getCertificateDetails(
    { patchState }: StateContext<NotificationsSettingsStateModel>,
    action: GetNotificationsSettings,
  ) {
    return this.notificationsService.fetchNotificationsSettings().pipe(
      tap((settings: DeferredResource<NotificationsSettingsStateModel>) => {
        patchState({ ...settings.response });
      }),
    );
  }

  @Action(UpdateNotificationsLogo)
  updateNotificationsLogo(
    { patchState }: StateContext<NotificationsSettingsStateModel>,
    action: UpdateNotificationsLogo,
  ) {
    return this.notificationsService.editNotificationsSettings(action.payload).pipe(
      tap((settings: DeferredResource<NotificationsSettingsStateModel>) => {
        patchState({ ...settings.response });
      }),
    );
  }
}
