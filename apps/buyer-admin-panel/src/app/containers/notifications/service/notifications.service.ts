import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Sort, SortObj } from '../../../../snatch/models/sort.model';
import { IPageable } from '../../../../snatch/models/page.model';
import { Observable } from 'rxjs';
import { DeferredResource } from '../../../../snatch/utils/deferred-resource';
import {
  ISearchParams,
  NotificationModel,
  NotificationPayloadModel,
  NotificationsListModel,
  NotificationsSettingsModel,
  ReportingDomainsMap,
} from '../models/notifications.model';
import { AdminPanelApiService } from '../../../services/admin-panel-api.service';
import { EnvironmentService } from '../../../../snatch/services';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(
    private readonly environment: EnvironmentService,
    private readonly adminPanelApiService: AdminPanelApiService,
  ) {}

  fetchNotificationsSettings(): Observable<DeferredResource<NotificationsSettingsModel>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/settings');
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<NotificationsSettingsModel>(url, new HttpHeaders({}), params);
  }

  fetchNotifications(
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

    const url = this.adminPanelApiService.prepareURL('/api/solar/domain-notification/list');

    return this.adminPanelApiService.get<NotificationsListModel>(url, new HttpHeaders({}), params);
  }

  fetchNotificationDetails(
    trigger: string,
    recipient: string,
    venue: string,
  ): Observable<DeferredResource<NotificationModel>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/domain-notification/details?trigger=${trigger}&recipient=${recipient}&venue=${venue}`,
    );
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<NotificationModel>(url, new HttpHeaders({}), params);
  }

  editNotificationsSettings(data: {
    notificationLogoBucket: string;
    notificationLogoKey: string;
  }): Observable<DeferredResource<NotificationsSettingsModel>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/update/logo');

    return this.adminPanelApiService.post<
      NotificationsSettingsModel,
      { notificationLogoBucket: string; notificationLogoKey: string }
    >(url, new HttpHeaders({}), data);
  }

  editNotification(data: NotificationPayloadModel): Observable<DeferredResource<NotificationModel>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/edit');

    return this.adminPanelApiService.post<NotificationModel, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  resetNotification(data: NotificationPayloadModel): Observable<DeferredResource<NotificationModel>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/reset');
    const params = new HttpParams();

    return this.adminPanelApiService.post<NotificationModel, NotificationPayloadModel>(
      url,
      new HttpHeaders({}),
      data,
      params,
    );
  }

  previewNotification(data: NotificationPayloadModel): Observable<DeferredResource<string>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/preview');

    return this.adminPanelApiService.post<string, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  testEmail(data: NotificationPayloadModel): Observable<DeferredResource<string>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/domain-notification/test');

    return this.adminPanelApiService.post<string, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  getReportingManagerMapping(): Observable<DeferredResource<ReportingDomainsMap[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/reporting-manager-by-domain');
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<ReportingDomainsMap[]>(url, new HttpHeaders({}), params);
  }
}
