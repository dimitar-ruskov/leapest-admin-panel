import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  AmberResponse,
  ILTEvent,
  ILTEventAttendance,
  ILTEventAttendanceCompletionPayload,
  ILTEventAttendancesByUser,
  ILTEventAttendanceUpdatePayload,
  ILTEventBulkMarkAttendancesPayload,
  ILTEventCustomAttendanceLight,
  IPageable
} from "../../models";
import { DeferredResource } from "../../utils/common";
import { AdminPanelApiService } from "../common/admin-panel-api.service";

@Injectable({
  providedIn: 'root',
})
export class AttendanceTrackingService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService, private readonly http: HttpClient) {}

  getILTEventAttendancesByUsers(
    eventSku: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/procurement/learners/attendance/details/by-sku/${eventSku}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);

    return this.adminPanelApiService.getWithFlags<ILTEventAttendancesByUser[]>(url, new HttpHeaders({}), params);
  }

  updateILTEventAttendance(eventId: string, data: ILTEventAttendanceUpdatePayload): Observable<ILTEventAttendance> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/details/${eventId}`,
    );

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEventAttendance>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  completeILTEventAttendance(eventId: string, data: ILTEventAttendanceCompletionPayload): Observable<ILTEvent> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/learners/attendance/${eventId}`);

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEvent>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  validateBulkILTEventAttendanceCompletion(
    eventId: string,
    data: Record<string, unknown>,
    allUsers?: boolean,
  ): Observable<any> {
    // TODO this method doesn't use, should be removed
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/validate-before-completion/${eventId}`,
    );

    const params = new HttpParams().append('allUsers', `${allUsers}`);

    return this.http
      .post<AmberResponse<any>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  markBulkAttendance(
    eventId: string,
    data: ILTEventBulkMarkAttendancesPayload,
  ): Observable<ILTEventBulkMarkAttendancesPayload> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/attendance/bulk/${eventId}`,
    );

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEventBulkMarkAttendancesPayload>>(url, data, { params })
      .pipe(map((t) => t.data));
  }

  getCustomAttendanceReasons(): Observable<ILTEventCustomAttendanceLight[]> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/custom-attendance/list');

    const params = new HttpParams();

    return this.http
      .get<AmberResponse<ILTEventCustomAttendanceLight[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  unmarkCompletion(eventId: string, data: ILTEventAttendanceCompletionPayload): Observable<ILTEvent> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/learners/unmark/attendance/${eventId}`,
    );

    const params = new HttpParams();

    return this.http
      .post<AmberResponse<ILTEvent>>(url, data, { params })
      .pipe(map((t) => t.data));
  }
}
