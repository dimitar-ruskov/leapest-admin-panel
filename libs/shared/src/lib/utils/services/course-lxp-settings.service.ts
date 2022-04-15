import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {PublishCourseToLXP, PublishedCourseToLXP, TargetLxpDomain} from "../../models/interfaces";
import {AdminPanelApiService} from "./common";
import {DeferredResource} from "../common";

@Injectable({
  providedIn: 'root',
})
export class CourseLxpSettingsService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  publishToLxp(payload: PublishCourseToLXP): Observable<DeferredResource<PublishedCourseToLXP[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/lxp/course/buyer/bulk/publish');

    const body = [payload];
    return this.adminPanelApiService.post(url, new HttpHeaders({}), body);
  }

  publishToLxpByDomain(payload: PublishCourseToLXP): Observable<DeferredResource<PublishedCourseToLXP[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/lxp/course/buyer/publish/by-domain');

    return this.adminPanelApiService.post(url, new HttpHeaders({}), payload);
  }

  getTargetDomains(courseId: string): Observable<DeferredResource<TargetLxpDomain[]>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/partner/lxp/course/target-domains/${courseId}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get(url, new HttpHeaders({}), params);
  }
}
