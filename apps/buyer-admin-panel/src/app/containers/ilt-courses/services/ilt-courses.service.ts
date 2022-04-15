import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";
import {AdminPanelApiService} from "../../../../../../../libs/shared/src/lib/utils/services/common";
import {
  DraftILTCourse, EventReview, ILTCourse,
  ILTEvent, ILTEventBase, ILTEventListItem, IPageable, PreILTCourse, PublishedILTCourse
} from "../../../../../../../libs/shared/src/lib/models/interfaces";

@Injectable({
  providedIn: 'root',
})
export class IltCoursesService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  private static addILTCoursesParams(params: HttpParams): HttpParams {
    params = params.append('@format.configKey', 'instructorLedCourse');

    return params;
  }

  getPublishedILTCourses(
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: PublishedILTCourse[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course/list');
    const params = IltCoursesService.addILTCoursesParams(this.adminPanelApiService.prepareParams(pageable));

    return this.adminPanelApiService.getWithFlags<PublishedILTCourse[]>(url, new HttpHeaders({}), params);
  }

  getDraftILTCourses(
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: DraftILTCourse[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/precourse/listby/draft');
    const params = IltCoursesService.addILTCoursesParams(this.adminPanelApiService.prepareParams(pageable));

    return this.adminPanelApiService.getWithFlags<DraftILTCourse[]>(url, new HttpHeaders({}), params);
  }

  deleteDraftILTCourse(id: string): Observable<DeferredResource<DraftILTCourse>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/precourse/delete');

    return this.adminPanelApiService.post<DraftILTCourse, { id: string }>(url, new HttpHeaders({}), { id });
  }

  getPreILTCourse(id: string): Observable<DeferredResource<PreILTCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/precourse/read/${id}`);
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<PreILTCourse>(url, new HttpHeaders({}), params);
  }

  updatePreILTCourse(
    updatedCourse: Partial<PreILTCourse>,
    attribute: string,
  ): Observable<DeferredResource<PreILTCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/precourse/details/update/${attribute}`);

    return this.adminPanelApiService.post<PreILTCourse, Partial<PreILTCourse>>(url, new HttpHeaders({}), updatedCourse);
  }

  scheduleILTCourseEvent(preCourseEvent: Partial<ILTEventBase>): Observable<DeferredResource<Partial<ILTEvent>>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/create');

    return this.adminPanelApiService.post<ILTEvent, Partial<ILTEventBase>>(url, new HttpHeaders({}), preCourseEvent);
  }

  getILTCourse(id: string): Observable<DeferredResource<PublishedILTCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course/details/${id}`);
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<PublishedILTCourse>(url, new HttpHeaders({}), params);
  }

  updateILTCourseAttribute(
    updatedCourse: PublishedILTCourse,
    attribute: string,
  ): Observable<DeferredResource<PublishedILTCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course/edit/attribute/${attribute}`);

    return this.adminPanelApiService.post<PublishedILTCourse, { id: string }>(url, new HttpHeaders({}), updatedCourse);
  }

  getILTCourseEvents(
    courseId: string,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventListItem[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/parent/list/lite/${courseId}`);
    const params = this.adminPanelApiService.prepareParams(pageable);

    return this.adminPanelApiService.getWithFlags<ILTEventListItem[]>(url, new HttpHeaders({}), params);
  }

  getILTCourseEventsLite(
    status: string,
    parentId: string,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventListItem[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/list/lite/${status}`);
    let params = this.adminPanelApiService.prepareParams(pageable);
    if (parentId) {
      params = params.append('parentId', parentId);
    }
    return this.adminPanelApiService.getWithFlags<ILTEventListItem[]>(url, new HttpHeaders({}), params);
  }

  getCourseReviews(courseId: string, pageable?: IPageable): Observable<DeferredResource<{ data: EventReview[] }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/partner/course-event-review/list/by-course/${courseId}`,
    );
    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<EventReview[]>(url, new HttpHeaders({}), params);
  }

  deleteCourseReviews(id: string, courseEventId: string): Observable<DeferredResource<EventReview>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-event-review/delete');

    const body = {
      id,
      courseEvent: {
        id: courseEventId,
      },
    };
    return this.adminPanelApiService.post<EventReview, { id: string; courseEvent: { id: string } }>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  deleteCourse(courseId: string): Observable<DeferredResource<ILTCourse>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course/delete');
    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService.post<ILTCourse, { id: string }>(
      url,
      new HttpHeaders({}),
      { id: courseId },
      params,
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
