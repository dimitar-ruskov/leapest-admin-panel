import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {AdminPanelApiService} from "../../../../../../../../../../../../libs/shared/src/lib/utils/services/common";
import {DeferredResource} from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {IPageable} from "../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  BulkUploadsSchedulingSummary,
  BulkUploadsValidationReport,
  CourseEventsBulkUploads,
  PublishingReportByStatus,
  UploadCourseEventsCsv
} from "../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/courses/ilt-course-events-bulk";

@Injectable({
  providedIn: 'root',
})
export class IltCourseEventsBulkService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  uploadCSV(data: UploadCourseEventsCsv, courseId: string): Observable<DeferredResource<UploadCourseEventsCsv>> {
    const url = this.adminPanelApiService.prepareURL(`/api/umbrella/course/event/create?courseId=${courseId}`);

    return this.adminPanelApiService.post<UploadCourseEventsCsv, UploadCourseEventsCsv>(url, new HttpHeaders({}), data);
  }

  listUploads(
    courseSku: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: CourseEventsBulkUploads[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/umbrella/course/event?courseSku=${courseSku}`);

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<CourseEventsBulkUploads[]>(url, new HttpHeaders({}), params);
  }

  getValidationReport(csvId: string): Observable<DeferredResource<BulkUploadsValidationReport>> {
    const url = this.adminPanelApiService.prepareURL(`/api/umbrella/course/event/validationreport?id=${csvId}`);

    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService.get<BulkUploadsValidationReport>(url, new HttpHeaders({}), params);
  }

  scheduleEvent(id: string): Observable<DeferredResource<{ id: string }>> {
    const url = this.adminPanelApiService.prepareURL('/api/umbrella/course/event/schedule');

    const data = { id };
    return this.adminPanelApiService.post<{ id: string }, { id: string }>(url, new HttpHeaders({}), data);
  }

  getSchedulingSummary(csvId: number): Observable<DeferredResource<BulkUploadsSchedulingSummary>> {
    const url = this.adminPanelApiService.prepareURL(`/api/umbrella/course/event/summary?sellerCsv=${csvId}`);

    const params = this.adminPanelApiService.prepareParams();
    return this.adminPanelApiService.get<BulkUploadsSchedulingSummary>(url, new HttpHeaders({}), params);
  }

  getSchedulingReport(
    status: string,
    csvId: number,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: PublishingReportByStatus[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/umbrella/course/event/by-status?status=${status}&sellerCsv=${csvId}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<PublishingReportByStatus[]>(url, new HttpHeaders({}), params);
  }
}
