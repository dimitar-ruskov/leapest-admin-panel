import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  SPCourseLanguageVariantCreationStep
} from "../../../models/courses/sp-courses/sp-course-create-variant-step.model";

import { SPCourseLanguageVariant } from '../../../models/courses/sp-courses/sp-course.model';
import {
  PreSPCourseLanguageVariant,
  PreSPCourseLanguageVariantCreatePayload,
  UpdateSpCourseLanguageVariantLearnersResponse,
} from '../../../models/courses/sp-courses/sp-course-language-variant.model';
import { SPCourseLanguageVariantLearner } from '../../../models/courses/sp-courses/sp-course-language-variant-learner.model';
import { SPCourseLanguageVariantExam } from '../../../models/courses/sp-courses/sp-course-language-variant-exam.model';
import {AdminPanelApiService} from "../../common";
import {DeferredResource} from "../../../utils/common";
import {
  ExportLearnersDto,
  IPageable,
  MaterialCompletionReport
} from "../../../models";


@Injectable({
  providedIn: 'root',
})
export class SpCourseLanguageVariantsService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getSPCourseLanguageVariants(
    id: string,
    pageable: IPageable,
  ): Observable<
    DeferredResource<{
      data: SPCourseLanguageVariant[];
      flags: { size: number };
    }>
  > {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/parent/list/${id}`);

    const params = this.adminPanelApiService.prepareParams(pageable);

    return this.adminPanelApiService.getWithFlags<SPCourseLanguageVariant[]>(url, new HttpHeaders({}), params);
  }

  createPreSPCourseLanguageVariant(
    body: PreSPCourseLanguageVariantCreatePayload,
  ): Observable<DeferredResource<PreSPCourseLanguageVariant>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/create');

    return this.adminPanelApiService.post<PreSPCourseLanguageVariant, PreSPCourseLanguageVariantCreatePayload>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  getPreSPCourseLanguageVariant(id: string): Observable<DeferredResource<PreSPCourseLanguageVariant>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/read/${id}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<PreSPCourseLanguageVariant>(url, new HttpHeaders({}), params);
  }

  updatePreSPCourseLanguageVariant(
    body: PreSPCourseLanguageVariant,
    step: SPCourseLanguageVariantCreationStep,
  ): Observable<DeferredResource<PreSPCourseLanguageVariant>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/details/update/${step}`);

    return this.adminPanelApiService.post<PreSPCourseLanguageVariant, PreSPCourseLanguageVariant>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  getSPCourseLanguageVariant(id: string): Observable<DeferredResource<SPCourseLanguageVariant>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/read/${id}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<SPCourseLanguageVariant>(url, new HttpHeaders({}), params);
  }

  getSPCourseLanguageVariantLearners(
    id: string,
    pageable: IPageable,
    status: 'pending' | 'active',
  ): Observable<
    DeferredResource<{
      data: SPCourseLanguageVariantLearner[];
      flags: { size: number };
    }>
  > {
    const url = this.adminPanelApiService.prepareURL('/api/solar/classevent/learners/status');

    let params = this.adminPanelApiService.prepareParams(pageable);

    params = params.append('id', id);

    if (status === 'active') {
      params = params.append('status', 'active');
      params = params.append('status', 'completed');
    } else if (status === 'pending') {
      params = params.append('status', 'pending');
    }

    return this.adminPanelApiService.getWithFlags<SPCourseLanguageVariantLearner[]>(url, new HttpHeaders({}), params);
  }

  assignSPCourseLanguageVariantLearner(
    id: string,
    body: string[],
  ): Observable<DeferredResource<UpdateSpCourseLanguageVariantLearnersResponse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/learners/add/${id}`);

    return this.adminPanelApiService.post<UpdateSpCourseLanguageVariantLearnersResponse, string[]>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  uploadLearnersFromCSVToEvent(
    id: string,
    body: SPCourseLanguageVariantLearner[],
  ): Observable<DeferredResource<UpdateSpCourseLanguageVariantLearnersResponse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/upload/learner/csv/${id}`);

    return this.adminPanelApiService.post<
      UpdateSpCourseLanguageVariantLearnersResponse,
      SPCourseLanguageVariantLearner[]
    >(url, new HttpHeaders({}), body);
  }

  removeSPCourseLanguageVariantLearner(
    id: string,
    body: string[],
  ): Observable<DeferredResource<UpdateSpCourseLanguageVariantLearnersResponse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/learners/remove/${id}`);

    return this.adminPanelApiService.post<UpdateSpCourseLanguageVariantLearnersResponse, string[]>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  rejectSPCourseLanguageVariantLearner(body: { username: string; courseEventId: string; message: string }) {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/learners/reject');

    return this.adminPanelApiService.post<any, { username: string; courseEventId: string; message: string }>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  approveSPCourseLanguageVariantLearner(body: { username: string; courseEventId: string }): Observable<any> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course-event/learners/approve');

    return this.adminPanelApiService.post<any, { username: string; courseEventId: string }>(
      url,
      new HttpHeaders({}),
      body,
    );
  }

  getSPCourseLanguageVariantExams(
    id: string,
    examVariantSKU: string,
    pageable: IPageable,
  ): Observable<
    DeferredResource<{
      data: SPCourseLanguageVariantExam[];
      flags: { size: number };
    }>
  > {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/course-event/assessments/list/${id}`);

    let params = this.adminPanelApiService.prepareParams(pageable);

    params = params.append('examVariantSKU', examVariantSKU);

    return this.adminPanelApiService.getWithFlags<SPCourseLanguageVariantExam[]>(url, new HttpHeaders({}), params);
  }

  updateSPCourseLanguageVariantAttribute(
    updatedLanguageVariant: SPCourseLanguageVariant,
    attribute: string,
  ): Observable<DeferredResource<PreSPCourseLanguageVariant>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/edit/attribute/${attribute}`);

    return this.adminPanelApiService.post<SPCourseLanguageVariant, SPCourseLanguageVariant>(
      url,
      new HttpHeaders({}),
      updatedLanguageVariant,
    );
  }

  getSPCourseLanguageVariantMaterialsTrackingList(
    id: string,
    materialSKU: string,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: MaterialCompletionReport[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-event/completion/report');
    let params = this.adminPanelApiService.prepareParams(pageable);

    params = params.append('courseEventId', id);
    params = params.append('materialSKU', materialSKU);

    return this.adminPanelApiService.getWithFlags<MaterialCompletionReport[]>(url, new HttpHeaders({}), params);
  }

  exportLearners(payload: ExportLearnersDto): Observable<DeferredResource<void>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/classevent/learners/export');

    return this.adminPanelApiService.post<void, ExportLearnersDto>(url, new HttpHeaders({}), payload);
  }
}
