import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminPanelApiService } from "../common/admin-panel-api.service";
import {DeferredResource} from "../../utils/common";
import {
  Certificate,
  CreateCourseModel,
  DraftILTCourse,
  GeneralCertificate,
  IPageable,
  S3Resource
} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getCertificates(
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: Certificate[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/certificates');

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<Certificate[]>(url, new HttpHeaders({}), params);
  }

  getCertificateDetails(id: string): Observable<DeferredResource<Certificate>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/certificates/details/${id}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<Certificate>(url, new HttpHeaders({}), params);
  }

  getCertificateCourses(
    certificateId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: DraftILTCourse[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/certificates/used-in/courses?id=${certificateId}`);

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<DraftILTCourse[]>(url, new HttpHeaders({}), params);
  }

  getCertificateIssued(
    certificateId: string,
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: GeneralCertificate[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/solar/certificates/list/issued?certificateId=${certificateId}`,
    );

    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<GeneralCertificate[]>(url, new HttpHeaders({}), params);
  }

  validateCertificateTemplate(
    s3Bucket: string,
    s3Key: string,
  ): Observable<DeferredResource<{ participantsNameValid: true }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/certificates/validate');

    const body: S3Resource = {
      s3Key,
      s3Bucket,
    };
    return this.adminPanelApiService.post<{ participantsNameValid: true }, S3Resource>(url, new HttpHeaders({}), body);
  }

  createCertificateTemplate(body: CreateCourseModel): Observable<DeferredResource<Certificate>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/certificates/add');

    return this.adminPanelApiService.post<Certificate, CreateCourseModel>(url, new HttpHeaders({}), body);
  }

  updateCertificateFields(certificate: Certificate): Observable<DeferredResource<Certificate>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/certificates/edit');

    return this.adminPanelApiService.post<Certificate, Certificate>(url, new HttpHeaders({}), certificate);
  }
}
