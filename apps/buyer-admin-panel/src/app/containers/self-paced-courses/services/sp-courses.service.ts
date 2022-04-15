import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ActiveSelfPacedCourse, DraftSelfPacedCourse, PreSelfPacedCourse } from '../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {
  IKeyValuePair, IPageable
} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {AdminPanelApiService} from "../../../../../../../libs/shared/src/lib/utils/services/common";
import {DeferredResource} from "../../../../../../../libs/shared/src/lib/utils/common";

@Injectable({
  providedIn: 'root',
})
export class SpCoursesService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  private static addSelfPacedCoursesParams(params: HttpParams): HttpParams {
    params = params.append('and', '1');
    params = params.append('@format.configKey', 'selfPacedCourse');

    return params;
  }

  getFullLanguageDictionary(): Observable<DeferredResource<{ data: IKeyValuePair[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/configuration/query/dictionary');

    let params = this.adminPanelApiService.prepareParams();

    params = params.append('@configType', 'language');
    params = params.append('showKeys', 'true');
    params = params.append('$configValue', '1');

    return this.adminPanelApiService.getWithFlags<IKeyValuePair[]>(url, new HttpHeaders({}), params);
  }

  getActiveSelfPacedCourses(
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: ActiveSelfPacedCourse[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course/list');

    const params = SpCoursesService.addSelfPacedCoursesParams(this.adminPanelApiService.prepareParams(pageable));

    return this.adminPanelApiService.getWithFlags<ActiveSelfPacedCourse[]>(url, new HttpHeaders({}), params);
  }

  getDraftSelfPacedCourses(
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: DraftSelfPacedCourse[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/precourse/listby/draft');

    const params = SpCoursesService.addSelfPacedCoursesParams(this.adminPanelApiService.prepareParams(pageable));

    return this.adminPanelApiService.getWithFlags<DraftSelfPacedCourse[]>(url, new HttpHeaders({}), params);
  }

  deleteDraftSelfPacedCourse(id: string): Observable<DeferredResource<DraftSelfPacedCourse>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/precourse/delete');

    return this.adminPanelApiService.post<DraftSelfPacedCourse, { id: string }>(url, new HttpHeaders({}), { id });
  }

  getPreSelfPacedCourse(id: string): Observable<DeferredResource<PreSelfPacedCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/precourse/read/${id}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<PreSelfPacedCourse>(url, new HttpHeaders({}), params);
  }

  updatePreSelfPacedCourse(
    updatedCourse: Partial<PreSelfPacedCourse>,
    attribute: string,
  ): Observable<DeferredResource<PreSelfPacedCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/precourse/details/update/${attribute}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.post<PreSelfPacedCourse, Partial<PreSelfPacedCourse>>(
      url,
      new HttpHeaders({}),
      updatedCourse,
      params,
    );
  }

  getActiveSelfPacedCourse(id: string): Observable<DeferredResource<ActiveSelfPacedCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course/details/${id}`);

    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<ActiveSelfPacedCourse>(url, new HttpHeaders({}), params);
  }

  updateSPCourseAttribute(
    updatedCourse: ActiveSelfPacedCourse,
    attribute: string,
  ): Observable<DeferredResource<ActiveSelfPacedCourse>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course/edit/attribute/${attribute}`);

    return this.adminPanelApiService.post<ActiveSelfPacedCourse, { id: string }>(
      url,
      new HttpHeaders({}),
      updatedCourse,
    );
  }
}
