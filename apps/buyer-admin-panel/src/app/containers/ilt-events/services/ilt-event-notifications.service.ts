import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISearchParams } from '../containers/ilt-events-details/containers/ilt-event-notifications/state/ilt-event-details-notifications.state';

import {
  NotificationModel, NotificationPayloadModel,
  NotificationRecipientsListModel,
  NotificationsListModel, ReportingDomainsMap
} from "../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";
import {IPageable, Sort, SortObj} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {AdminPanelApiService, EnvironmentService} from "../../../../../../../libs/shared/src/lib/utils/services/common";
import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";

@Injectable({
  providedIn: 'root',
})
export class IltEventNotificationsService {
  constructor(
    private readonly environment: EnvironmentService,
    private readonly adminPanelApiService: AdminPanelApiService,
  ) {}

  list(
    eventSku: string,
    filters: ISearchParams = {},
    sort: Sort = {},
    pageable?: IPageable,
  ): Observable<DeferredResource<NotificationsListModel>> {
    let sortObject: SortObj;
    if (sort?.key) {
      sortObject = {};
      sortObject[`$${sort.key}`] = sort.order;
    } else {
      sortObject = null;
    }

    const params: any = {
      ...(pageable as { page: number; limit: number }),
      ...filters,
      ...sortObject,
    };

    delete params.limit;
    if (!params.filter) {
      delete params.filter;
    }

    const url = `${this.environment.amberBaseUrl}/api/solar/course-notification/procurement/event/by-sku/${eventSku}`;

    return this.adminPanelApiService.get<NotificationsListModel>(url, new HttpHeaders({}), params);
  }

  details(
    eventSku: string,
    trigger: string,
    recipient: string,
    venue: string,
  ): Observable<DeferredResource<NotificationModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-notification/procurement/event/details/by-sku/${eventSku}?trigger=${trigger}&recipient=${recipient}&venue=${venue}`;

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<NotificationModel>(url, new HttpHeaders({}), params);
  }

  getRecipients(
    eventSku: string,
    trigger: string,
    recipient: string,
    pageable: IPageable,
  ): Observable<DeferredResource<NotificationRecipientsListModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/course-notification/procurement/event/recipients/by-sku/${eventSku}?role=${recipient}&trigger=${trigger}`;

    const params = this.adminPanelApiService.prepareParams(pageable);

    return this.adminPanelApiService.get<NotificationRecipientsListModel>(url, new HttpHeaders({}), params);
  }

  edit(notificationId: string, data: NotificationPayloadModel): Observable<DeferredResource<NotificationModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/event/edit/${notificationId}`;

    return this.adminPanelApiService.post<NotificationModel, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  reset(
    notificationId: string,
    data: NotificationPayloadModel,
    level: string,
  ): Observable<DeferredResource<NotificationModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/event/reset/${notificationId}`;

    const params = new HttpParams().set('level', level);

    return this.adminPanelApiService.post<NotificationModel, NotificationPayloadModel>(
      url,
      new HttpHeaders({}),
      data,
      params,
    );
  }

  preview(notificationId: string, data: NotificationPayloadModel): Observable<DeferredResource<string>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/event/preview/${notificationId}`;

    return this.adminPanelApiService.post<string, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  testEmail(eventId: string, data: NotificationPayloadModel): Observable<DeferredResource<string>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/event/test/${eventId}`;

    return this.adminPanelApiService.post<string, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  getReportingManagerMapping(): Observable<DeferredResource<ReportingDomainsMap[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/reporting-manager-by-domain`;
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<ReportingDomainsMap[]>(url, new HttpHeaders({}), params);
  }
}
