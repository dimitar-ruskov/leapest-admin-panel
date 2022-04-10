import { Action, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IltEventNotificationsService } from '../../../../../services/ilt-event-notifications.service';
import {
  FetchEventDetailsILTNotifications,
  ToggleSort,
  ChangePage,
  TestEmail,
  ClearNotificationDetails,
  GetNotificationDetails,
  PreviewNotificationTemplate,
  UpdateNotificationTemplate,
  ResetNotificationTemplate,
  ClearNotificationDetailsPartial,
  GetReportingManagerMapping,
  GetNotificationRecipients,
  ClearSearchForm,
} from './ilt-event-details-notifications.actions';

import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel,
  NotificationRecipientsListModel,
  ReportingDomainsMap
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {IPageable, Sort} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {IGlobalStateModel} from "../../../../../../../state/state.model";


export interface ISearchParams {
  filter?: string;
  recipient?: string[];
  trigger?: string[];
  venue?: string;
}

export interface ISearchMetadata {
  totalCount: number;
}

export class IltEventDetailsNotificationsStateModel {
  notifications: DeferredResource<any[]>;
  searchMetadata: ISearchMetadata;
  pagination: IPageable;
  searchForm: {
    model: ISearchParams;
    dirty: boolean;
    status: string;
    errors: any;
  };

  sort: Sort;

  recipients: NotificationRecipientsListModel;
  recipientsLoading: boolean;

  details: DeferredResource<NotificationModel>;
  updateTemplate: DeferredResource<NotificationModel>;
  resetTemplate: DeferredResource<NotificationModel>;
  testEmail: DeferredResource<string>;
  previewTemplate: DeferredResource<string>;
  reportingManagerMapping: DeferredResource<ReportingDomainsMap[]>;
}

const defaults = {
  notifications: undefined,
  searchMetadata: undefined,
  pagination: { limit: 10, page: 1 },
  searchForm: {
    model: undefined,
    dirty: false,
    status: '',
    errors: {},
  },
  sort: {},

  details: undefined,
  recipients: undefined,
  recipientsLoading: false,

  updateTemplate: undefined,
  resetTemplate: undefined,
  testEmail: undefined,
  previewTemplate: undefined,
  reportingManagerMapping: undefined,
};
@State<IltEventDetailsNotificationsStateModel>({
  name: 'iltEventDetailsNotifications',
  defaults,
})
@Injectable()
export class IltEventDetailsNotificationsState {
  constructor(private readonly store: Store, private readonly service: IltEventNotificationsService) {}

  @Action(FetchEventDetailsILTNotifications)
  fetchNotifications(
    { getState, patchState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: FetchEventDetailsILTNotifications,
  ): Observable<any> {
    const event = this.store.selectSnapshot((state: IGlobalStateModel) => state.iltEvents.iltEventDetails.iltEvent.response);
    const eventSku = action.sku || event.sku;
    const venue = event?.classEvent?.virtualVenue ? 'v-ilt' : 'ilt';
    const { searchForm, pagination, sort } = getState();

    const filters: ISearchParams = { ...searchForm.model, venue };

    return this.service.list(eventSku, filters, sort, pagination).pipe(
      filter((x) => x.isSuccess),
      tap((data: DeferredResource<{ data: NotificationModel[]; count: number }>) => {
        const result = data.unwrap((res) => res.data);
        patchState({
          notifications: result,
          searchMetadata: { totalCount: data.response?.count ?? 0 },
        });
      }),
    );
  }

  @Action(ToggleSort)
  toggleSort({ patchState, getState }: StateContext<IltEventDetailsNotificationsStateModel>, action: ToggleSort): void {
    if (!action.key) {
      patchState({ sort: { key: undefined, order: undefined } });
    } else {
      patchState({ ...getState(), sort: { key: action.key, order: action.direction } });
    }
  }

  @Action(ChangePage)
  changePage({ patchState, getState }: StateContext<IltEventDetailsNotificationsStateModel>, action: ChangePage): void {
    patchState({ pagination: { ...getState().pagination, page: action.payload } });
  }

  @Action(GetNotificationDetails)
  getNotificationDetails(
    { patchState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: GetNotificationDetails,
  ): Observable<any> {
    return this.service.details(action.eventSku, action.trigger, action.recipient, action.venue).pipe(
      tap((data: DeferredResource<NotificationModel>) => {
        patchState({ details: data });
      }),
    );
  }

  @Action(GetNotificationRecipients)
  getNotificationRecipients(
    { patchState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: GetNotificationRecipients,
  ): Observable<any> {
    return this.service.getRecipients(action.eventSku, action.trigger, action.recipient, action.pageable).pipe(
      tap((data: DeferredResource<NotificationRecipientsListModel>) => {
        patchState({ recipientsLoading: data.isPending });
        if (data.isSuccess) {
          patchState({ recipients: data.response });
        }
      }),
    );
  }

  @Action(ResetNotificationTemplate)
  resetNotificationTemplate(
    { patchState, dispatch, getState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: ResetNotificationTemplate,
  ): Observable<any> {
    const data = {
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
    const eventId = getState().details.response.courseEventId;
    return this.service.reset(eventId, data, action.level).pipe(
      tap((resp: DeferredResource<NotificationModel>) => {
        patchState({ resetTemplate: resp });
        if (resp.isSuccess) {
          dispatch(new GetNotificationDetails(action.eventSku, action.trigger, action.recipient, action.venue));
        }
      }),
    );
  }

  @Action(TestEmail)
  testEmail(
    { patchState, getState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: TestEmail,
  ): Observable<any> {
    const data = {
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
    const eventId = getState().details.response.courseEventId;
    return this.service.testEmail(eventId, data).pipe(
      tap((resp: DeferredResource<string>) => {
        patchState({ testEmail: resp });
      }),
    );
  }

  @Action(UpdateNotificationTemplate)
  updateNotificationTemplate(
    { patchState, getState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: UpdateNotificationTemplate,
  ): Observable<any> {
    const eventId = getState().details.response.courseEventId;
    return this.service.edit(eventId, action.data).pipe(
      tap((data: DeferredResource<NotificationModel>) => {
        patchState({ updateTemplate: data });
      }),
    );
  }

  @Action(PreviewNotificationTemplate)
  previewNotificationTemplate(
    { patchState, getState }: StateContext<IltEventDetailsNotificationsStateModel>,
    action: PreviewNotificationTemplate,
  ): Observable<any> {
    const eventId = action.eventId || getState().details.response.courseEventId;
    return this.service.preview(eventId, action.data).pipe(
      tap((data: DeferredResource<string>) => {
        patchState({ previewTemplate: data });
      }),
    );
  }

  @Action(ClearNotificationDetailsPartial)
  clearNotificationDetailsPartial({ patchState }: StateContext<IltEventDetailsNotificationsStateModel>): void {
    patchState({
      testEmail: undefined,
      resetTemplate: undefined,
    });
  }

  @Action(ClearNotificationDetails)
  clearNotificationDetails({ patchState }: StateContext<IltEventDetailsNotificationsStateModel>): void {
    patchState(defaults);
  }

  @Action(GetReportingManagerMapping)
  getReportingManagerMapping({ patchState }: StateContext<IltEventDetailsNotificationsStateModel>): Observable<any> {
    return this.service.getReportingManagerMapping().pipe(
      tap((data: DeferredResource<ReportingDomainsMap[]>) => {
        patchState({ reportingManagerMapping: data });
      }),
    );
  }

  @Action(ClearSearchForm)
  clearSearchForm({ patchState }: StateContext<IltEventDetailsNotificationsStateModel>) {
    patchState({
      searchForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {},
      },
    });
  }
}
