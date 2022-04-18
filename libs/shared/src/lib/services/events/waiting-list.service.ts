import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AmberResponse,
  AssignLearnersResponse,
  IKeyValuePair,
  ILTEvent, ILTEventLearner, IPageable
} from "../../models";
import {DeferredResource} from "../../utils/common";
import { AdminPanelApiService } from "../common/admin-panel-api.service";

@Injectable({
  providedIn: 'root',
})
export class WaitingListService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService, private readonly http: HttpClient) {}

  getEventWaitingListLearners(
    eventId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventLearner[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/classevent/learners/status?id=${eventId}&status=waiting-list`,
    );
    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ILTEventLearner[]>(url, new HttpHeaders({}), params);
  }

  promoteLearner(classEventId: string, data: { username: string }): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/waiting/promote/${classEventId}`,
    );
    const params = this.adminPanelApiService.prepareParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  demoteLearner(classEventId: string, data: { username: string }): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/waiting/demote/${classEventId}`,
    );
    const params = this.adminPanelApiService.prepareParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  enableWaitingList(eventId: string, data: { capacity: number }): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/waiting-list/enable/${eventId}`);
    return this.adminPanelApiService.post<ILTEvent, { capacity: number }>(url, new HttpHeaders({}), data);
  }

  disableWaitingList(eventId: string): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/waiting-list/disable/${eventId}`);
    return this.adminPanelApiService.post<ILTEvent, Record<string, unknown>>(url, new HttpHeaders({}), {});
  }

  addLearnersWaitingList(classEventId: string, learners: string[]): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/waiting-list/add-learners/${classEventId}`,
    );
    const params = this.adminPanelApiService.prepareParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, learners, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  removeLearnersWaitingList(classEventId: string, learners: ILTEventLearner[]): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/waiting-list/remove-learners/${classEventId}`,
    );
    const params = this.adminPanelApiService.prepareParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, learners, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  validateWaitingListLearners(parentId: string, emails: string[]): Observable<IKeyValuePair[]> {
    const encodedEmails = emails.map((mail) => encodeURIComponent(mail));
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/waiting-list/join/validate/${parentId}?emails=${encodedEmails.join(',')}`,
    );
    return this.http.get<AmberResponse<IKeyValuePair[]>>(url).pipe(map((t: { data: IKeyValuePair[] }) => t.data));
  }
}
