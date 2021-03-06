import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";

import { DeferredResource } from "../../utils/common";
import { AdminPanelApiService } from "../common/admin-panel-api.service";
import { CourseCategory } from "../../models";

@Injectable({
  providedIn: 'root',
})
export class LmsCategoriesService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getLMSCategories(): Observable<DeferredResource<CourseCategory[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/agora/category/lms/list');
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<CourseCategory[]>(url, new HttpHeaders({}), params);
  }

  createLMSCategory(name: string, description?: string): Observable<DeferredResource<CourseCategory>> {
    const url = this.adminPanelApiService.prepareURL('/api/agora/category/lms/add');
    const body = description ? { name, description } : { name };

    return this.adminPanelApiService.post<CourseCategory, Partial<CourseCategory>>(url, new HttpHeaders({}), body);
  }
}
