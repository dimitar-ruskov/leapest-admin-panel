import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { NotificationsService } from '../../../../../../../../../libs/shared/src/lib/services/notifications/notifications.service';
import {
  ClearNotificationDetails,
  ClearNotificationDetailsPartial,
  GetNotificationDetails,
  GetReportingManagerMapping,
  PreviewNotificationTemplate,
  ResetNotificationTemplate,
  TestEmail,
  UpdateNotificationTemplate,
} from './notification-details.action';

import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel, NotificationPayloadModel,
  ReportingDomainsMap
} from "../../../../../../../../../libs/shared/src/lib/models/notifications/notifications.model";

export class NotificationDetailsStateModel {
  details: DeferredResource<NotificationModel>;
  previewTemplate: DeferredResource<string>;
  updateTemplate: DeferredResource<NotificationModel>;
  resetTemplate: DeferredResource<NotificationModel>;
  testEmail: DeferredResource<string>;
  reportingManagerMapping: DeferredResource<ReportingDomainsMap[]>;
}

@State<NotificationDetailsStateModel>({
  name: 'notificationDetails',
  defaults: {
    details: undefined,
    previewTemplate: undefined,
    updateTemplate: undefined,
    resetTemplate: undefined,
    testEmail: undefined,
    reportingManagerMapping: undefined,
  },
})
@Injectable()
export class NotificationDetailsState {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Action(GetNotificationDetails)
  getNotificationDetails({ patchState }: StateContext<NotificationDetailsStateModel>, action: GetNotificationDetails) {
    return this.notificationsService.fetchNotificationDetails(action.trigger, action.recipient, action.venue).pipe(
      tap((data: DeferredResource<NotificationModel>) => {
        patchState({ details: data });
      }),
    );
  }

  @Action(ClearNotificationDetailsPartial)
  clearNotificationDetailsPartial({ patchState }: StateContext<NotificationDetailsStateModel>) {
    patchState({
      testEmail: undefined,
      resetTemplate: undefined,
    });
  }

  @Action(ClearNotificationDetails)
  clearNotificationDetails({ patchState }: StateContext<NotificationDetailsStateModel>) {
    patchState({
      details: undefined,
      updateTemplate: undefined,
      resetTemplate: undefined,
      testEmail: undefined,
      reportingManagerMapping: undefined,
    });
  }

  @Action(PreviewNotificationTemplate)
  previewNotificationTemplate(
    { patchState }: StateContext<NotificationDetailsStateModel>,
    action: PreviewNotificationTemplate,
  ) {
    return this.notificationsService.previewNotification(action.data).pipe(
      tap((data: DeferredResource<string>) => {
        patchState({ previewTemplate: data });
      }),
    );
  }

  @Action(ResetNotificationTemplate)
  resetNotificationTemplate(
    { patchState, dispatch }: StateContext<NotificationDetailsStateModel>,
    action: ResetNotificationTemplate,
  ) {
    const data: NotificationPayloadModel = {
      trigger: {
        configKey: action.trigger,
      },
      recipient: {
        configKey: action.recipient,
      },
      venue: {
        configKey: action.venue,
      },
    };

    return this.notificationsService.resetNotification(data).pipe(
      tap((resp: DeferredResource<NotificationModel>) => {
        patchState({ resetTemplate: resp });
        if (resp.isSuccess) {
          dispatch(new GetNotificationDetails(action.trigger, action.recipient, action.venue));
        }
      }),
    );
  }

  @Action(UpdateNotificationTemplate)
  updateNotificationTemplate(
    { patchState }: StateContext<NotificationDetailsStateModel>,
    action: UpdateNotificationTemplate,
  ) {
    return this.notificationsService.editNotification(action.data).pipe(
      tap((data: DeferredResource<NotificationModel>) => {
        patchState({ updateTemplate: data });
      }),
    );
  }

  @Action(TestEmail)
  testEmail({ patchState }: StateContext<NotificationDetailsStateModel>, action: TestEmail) {
    const data: NotificationPayloadModel = {
      trigger: {
        configKey: action.trigger,
      },
      recipient: {
        configKey: action.recipient,
      },
      venue: {
        configKey: action.venue,
      },
    };

    return this.notificationsService.testEmail(data).pipe(
      tap((resp: DeferredResource<string>) => {
        patchState({ testEmail: resp });
      }),
    );
  }

  @Action(GetReportingManagerMapping)
  getReportingManagerMapping({ patchState }: StateContext<NotificationDetailsStateModel>) {
    return this.notificationsService.getReportingManagerMapping().pipe(
      tap((data: DeferredResource<ReportingDomainsMap[]>) => {
        patchState({ reportingManagerMapping: data });
      }),
    );
  }
}
