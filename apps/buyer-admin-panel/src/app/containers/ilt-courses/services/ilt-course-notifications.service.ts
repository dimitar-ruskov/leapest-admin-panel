import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISearchParams } from '../containers/ilt-course-details/containers/ilt-course-notifications/state/ilt-course-details-notifications.state';

import {IPageable, Sort, SortObj} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {AdminPanelApiService, EnvironmentService} from "../../../../../../../libs/shared/src/lib/utils/services/common";
import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";
import {
  NotificationModel, NotificationPayloadModel,
  NotificationsListModel, ReportingDomainsMap
} from "../../../../../../../libs/shared/src/lib/models/interfaces/notifications/notifications.model";

@Injectable({
  providedIn: 'root',
})
export class IltCourseNotificationsService {
  constructor(
    private readonly environment: EnvironmentService,
    private readonly adminPanelApiService: AdminPanelApiService,
  ) {}

  list(
    courseId: string,
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

    const url = `${this.environment.amberBaseUrl}/api/solar/course-notification/${courseId}`;

    return this.adminPanelApiService.get<NotificationsListModel>(url, new HttpHeaders({}), params);
  }

  details(
    courseId: string,
    trigger: string,
    recipient: string,
    venue: string,
  ): Observable<DeferredResource<NotificationModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/details/${courseId}?trigger=${trigger}&recipient=${recipient}&venue=${venue}`;

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<NotificationModel>(url, new HttpHeaders({}), params);
  }

  edit(notificationId: string, data: NotificationPayloadModel): Observable<DeferredResource<NotificationModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/edit/${notificationId}`;

    return this.adminPanelApiService.post<NotificationModel, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  reset(
    notificationId: string,
    data: NotificationPayloadModel,
    level: string,
  ): Observable<DeferredResource<NotificationModel>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/reset/${notificationId}`;

    const params = new HttpParams().set('level', level);

    return this.adminPanelApiService.post<NotificationModel, NotificationPayloadModel>(
      url,
      new HttpHeaders({}),
      data,
      params,
    );
  }

  preview(notificationId: string, data: NotificationPayloadModel): Observable<DeferredResource<string>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/preview/${notificationId}`;

    return this.adminPanelApiService.post<string, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  testEmail(courseId: string, data: NotificationPayloadModel): Observable<DeferredResource<string>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/partner/course-notification/test/${courseId}`;

    return this.adminPanelApiService.post<string, NotificationPayloadModel>(url, new HttpHeaders({}), data);
  }

  getReportingManagerMapping(): Observable<DeferredResource<ReportingDomainsMap[]>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/reporting-manager-by-domain`;
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<ReportingDomainsMap[]>(url, new HttpHeaders({}), params);
  }
}
