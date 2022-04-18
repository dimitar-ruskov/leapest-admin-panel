import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {ILTEventListItem, IPageable, InstructorLite} from "../../models";
import {DeferredResource} from "../../utils/common";
import { AdminPanelApiService } from "../common/admin-panel-api.service";

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getInstructors(
    pageable?: IPageable,
  ): Observable<DeferredResource<{ data: InstructorLite[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/instructor/lite/list');
    const params = this.adminPanelApiService.prepareParams(pageable);
    return this.adminPanelApiService.getWithFlags<InstructorLite[]>(url, new HttpHeaders({}), params);
  }

  createInstructor(body: InstructorLite): Observable<DeferredResource<InstructorLite>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/instructor/add');
    return this.adminPanelApiService.post<InstructorLite, InstructorLite>(url, new HttpHeaders({}), body);
  }

  updateInstructor(instructor: InstructorLite): Observable<DeferredResource<InstructorLite>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/instructor/edit');
    return this.adminPanelApiService.post<InstructorLite, InstructorLite>(url, new HttpHeaders({}), instructor);
  }

  getInstructorDetails(userId: string): Observable<DeferredResource<InstructorLite>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/user/details/${userId}`);
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<InstructorLite>(url, new HttpHeaders({}), params);
  }

  getEvents(
    instructorId: string,
    status: string,
    pageable: IPageable,
  ): Observable<DeferredResource<{ data: ILTEventListItem[]; flags: { size: number } }>> {
    const url = this.adminPanelApiService.prepareURL(`/api/solar/course-event/list/lite/instructor/${status}`);
    const params = this.adminPanelApiService.prepareParams(pageable).append('instructorId', instructorId);

    return this.adminPanelApiService.getWithFlags<ILTEventListItem[]>(url, new HttpHeaders({}), params);
  }
}
