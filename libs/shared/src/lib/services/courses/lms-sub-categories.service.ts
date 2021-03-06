import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";

import { CourseSubCategory, CreateCourseSubCategoryPayload } from "../../models";
import { AdminPanelApiService } from "../common/admin-panel-api.service";
import { DeferredResource } from "../../utils/common";

@Injectable({
  providedIn: 'root',
})
export class LmsSubCategoriesService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  getLMSSubCategories(categoryId: string): Observable<DeferredResource<CourseSubCategory[]>> {
    const url = this.adminPanelApiService.prepareURL(
      `/api/agora/product-seller/dictionary/product-group-by-category/${categoryId}`,
    );
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.get<CourseSubCategory[]>(url, new HttpHeaders({}), params);
  }

  createLMSSubCategory(body: CreateCourseSubCategoryPayload): Observable<DeferredResource<CourseSubCategory>> {
    const url = this.adminPanelApiService.prepareURL('/api/agora/productgroup/add');
    return this.adminPanelApiService.post<CourseSubCategory, CreateCourseSubCategoryPayload>(
      url,
      new HttpHeaders({}),
      body,
    );
  }
}
