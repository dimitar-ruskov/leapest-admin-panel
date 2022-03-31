import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminPanelApiService } from './admin-panel-api.service';
import { DeferredResource } from '../../snatch/utils/deferred-resource';
import { CourseSubCategory, CreateCourseSubCategoryPayload } from '../models/course-sub-category.model';
import { HttpHeaders } from '@angular/common/http';

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
