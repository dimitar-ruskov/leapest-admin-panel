import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AmberResponse,
  AssignLearnersResponse,
  ILTEventLearner, ILTEventUnenrolledLearner,
  IPageable
} from "../../models";
import {AdminPanelApiService} from "../common";
import {DeferredResource} from "../../utils/common";

@Injectable({
  providedIn: 'root',
})
export class IltEventLearnersService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService, private readonly http: HttpClient) {}

  getEventActiveLearners(
    eventId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventLearner[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/classevent/learners/status?id=${eventId}&status=active&status=completed`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ILTEventLearner[]>(url, new HttpHeaders({}), params);
  }

  getEventPendingLearners(
    eventId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventLearner[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/classevent/learners/status?id=${eventId}&status=pending`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ILTEventLearner[]>(url, new HttpHeaders({}), params);
  }

  getEventUnenrolledLearners(
    eventId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventUnenrolledLearner[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/classevent/learners/status?id=${eventId}&status=unenrolled`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ILTEventUnenrolledLearner[]>(url, new HttpHeaders({}), params);
  }

  exportLearners(classEventId: string, csvType: string, statuses: string[] = []): Observable<void> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/classevent/learners/export');

    const params = this.adminPanelApiService.prepareParams();
    const data = {
      id: classEventId,
      csvType,
      statuses,
    };
    return this.http.post<void>(url, data, {
      params,
    });
  }

  removeLearner(eventId: string, data: string[]): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/learners/remove/${eventId}`);

    const params = this.adminPanelApiService.prepareParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  approveLearner(body: { username: string; courseEventId: string }): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/learners/approve');

    return this.http.post<AmberResponse<AssignLearnersResponse>>(url, body).pipe(map((t) => t.data));
  }

  rejectLearner(data: {
    username: string;
    courseEventId: string;
    message: string;
  }): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/learners/reject');

    const params = this.adminPanelApiService.prepareParams();
    return this.http
      .post<AmberResponse<AssignLearnersResponse>>(url, data, {
        params,
      })
      .pipe(map((t) => t.data));
  }

  uploadLearnersFromCSVToILTEvent(id: string, body: ILTEventLearner[]): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/upload/learner/csv/${id}`);

    return this.http.post<AmberResponse<AssignLearnersResponse>>(url, body).pipe(map((t) => t.data));
  }

  assignLearners(eventId: string, data: string[]): Observable<AssignLearnersResponse> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/learners/add/${eventId}`);

    return this.http.post<AmberResponse<AssignLearnersResponse>>(url, data).pipe(map((t) => t.data));
  }
}
