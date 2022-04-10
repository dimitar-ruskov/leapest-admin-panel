import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AmberResponse,
  EventReview,
  ExamCompletionReport, IKeyValuePair,
  ILTEvent, ILTEventBase, ILTEventLearner, ILTEventListItem, IPageable, MaterialCompletionReport,
  PublishedILTCourse
} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";
import {AdminPanelApiService} from "../../../../../../../libs/shared/src/lib/utils/services/common";


@Injectable({
  providedIn: 'root',
})
export class IltEventsService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService, private readonly http: HttpClient) {}

  getILTEvents(
    status: string,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventListItem[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/course-event/list/lite/${status}?instance=false&isForCEP=true`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ILTEventListItem[]>(url, new HttpHeaders({}), params);
  }

  getExtendedILTEvents(
    status: string,
    pageable: IPageable,
  ): Observable<
    DeferredResource<{ data: { courseEvents: ILTEventListItem[]; pendingCount: number }[]; flags: { size: number } }>
  > {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/course-event/list/lite/extended/${status}?instance=false&isForCEP=true`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<{ courseEvents: ILTEventListItem[]; pendingCount: number }[]>(
      url,
      new HttpHeaders({}),
      params,
    );
  }

  getILTEventDetails(sku: string): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/procurement/read/by-sku/${sku}`);

    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService.get<ILTEvent>(url, new HttpHeaders({}), params);
  }

  updateILTEventDetails(data: ILTEvent, key: string): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/details/update/${key}`);

    return this.adminPanelApiService.post<ILTEvent, ILTEvent>(url, new HttpHeaders({}), data);
  }

  getCourseOptionsForEvent(): Observable<AmberResponse<IKeyValuePair[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/root/course/dictionary/instructorLedCourse');

    const params = this.adminPanelApiService.prepareParams();
    return this.http.get<AmberResponse<IKeyValuePair[]>>(url, { params });
  }

  getILTCourse(id: string): Observable<DeferredResource<PublishedILTCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course/details/${id}`);
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<PublishedILTCourse>(url, new HttpHeaders({}), params);
  }

  initiateILTEventCreation(data: ILTEventBase): Observable<AmberResponse<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/create');

    const params = this.adminPanelApiService.prepareParams();
    return this.http.post<AmberResponse<ILTEvent>>(url, data, { params });
  }

  getEventWaitingListLearners(eventId: string, pageable?: IPageable) {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/classevent/learners/status?id=${eventId}&status=waiting-list`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ILTEventLearner[]>(url, new HttpHeaders({}), params);
  }

  updateILTEventAttribute(body: ILTEvent, key: string): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/edit/attribute/${key}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.post<ILTEvent, ILTEvent>(url, new HttpHeaders({}), body, params);
  }

  getEventMaterialTrackingList(
    eventId: string,
    variantSku: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: MaterialCompletionReport[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/completion/report?courseEventId=${eventId}&materialSKU=${variantSku}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<MaterialCompletionReport[]>(url, new HttpHeaders({}), params);
  }

  getILTEventExams(
    eventId: string,
    variantSku: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: ExamCompletionReport[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event/assessments/list/${eventId}?examVariantSKU=${variantSku}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<ExamCompletionReport[]>(url, new HttpHeaders({}), params);
  }

  getEventReviews(eventId: string, pageable?: IPageable): Observable<DeferredResource<{ data: EventReview[] }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event-review/list/by-course-event/${eventId}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<EventReview[]>(url, new HttpHeaders({}), params);
  }

  deleteCourseEventReviews(id: string, eventId: string): Observable<DeferredResource<EventReview>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-event-review/delete');

    const body = {
      id: id,
      courseEvent: {
        id: eventId,
      },
    };
    return this.adminPanelApiService.post<EventReview, { id: string; courseEvent: { id: string } }>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  cancelEvent(id: string, cancelReason: string): Observable<DeferredResource<ILTEvent>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/internal/cancel');

    const body = {
      cancellationMessage: cancelReason,
      id: id,
      isInternal: true,
    };
    return this.adminPanelApiService.post<ILTEvent, { id: string; cancellationMessage: string; isInternal: boolean }>(
      url,
      new HttpHeaders({}),
      body,
    );
  }
}
