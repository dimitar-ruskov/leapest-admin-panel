import { Injectable } from '@angular/core';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {CourseCategory, CourseSubCategory, ILTCourseCategory} from "../../models/interfaces";
import {
  CreateSubCategoryModalComponent
} from "../../components/modals/create-sub-category-modal/create-sub-category-modal.component";
import {DeferredResource} from "../common";
import {LmsSubCategoriesService} from "./lms-sub-categories.service";
import {LmsCategoriesService} from "./lms-categories.service";
import {EditCategoryModalComponent} from "../../components/modals/edit-category-modal/edit-category-modal.component";
import {
  CreateCategoryModalComponent
} from "../../components/modals/create-category-modal/create-category-modal.component";
import {AdminCoursesService} from "./admin-courses.service";


@Injectable({
  providedIn: 'root',
})
export class CourseCategoryAndSubcategoryHandlerService {

  static editableProps = [
    'categoryId',
    'categoryName',
    'categoryCode',
    'subcategoryId',
    'subcategoryName',
    'subcategoryCode'
  ];

  constructor(
    private readonly modalService: NzModalService,
    private readonly lmsCategoriesService: LmsCategoriesService,
    private readonly lmsSubCategoriesService: LmsSubCategoriesService,
    private readonly adminCoursesService: AdminCoursesService
  ) {
  }

  private static extractCategory(course: any): CourseCategory {
    return {
      id: course.categoryId,
      name: course.categoryName,
      code: course.categoryCode
    };
  }

  private static extractSubCategory(course: any): CourseSubCategory {
    return {
      id: course.subcategoryId,
      name: course.subcategoryName,
      code: course.subcategoryCode
    };
  }

  editCategory<T, A>(course: T,
    categoryDictionary: CourseCategory[],
    dispatchAction: (updatedCourse: T) => Observable<A>,
    subCategoryDictionary: CourseSubCategory[] = []
  ): void {
    const selectedCategory = CourseCategoryAndSubcategoryHandlerService.extractCategory(course);
    const selectedSubCategory = CourseCategoryAndSubcategoryHandlerService.extractSubCategory(course);
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Category And Subcategory',
      nzContent: EditCategoryModalComponent,
      nzComponentParams: {
        selectedCategory,
        selectedSubCategory,
        categoryDictionary,
        subCategoryDictionary
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [{
        label: 'Cancel',
        type: 'default',
        onClick: () => modal.destroy()
      }, {
        label: 'Save Changes',
        type: 'primary',
        disabled: (d) => !d.form.valid || d.form.pristine,
        onClick: (data) => {
          const { category, subCategory } = data.form.getRawValue();
          const updatedCourse = {
            ...course,
            categoryId: category.id,
            categoryName: category.name,
            categoryCode: category.code,
            subcategoryId: subCategory?.id || null,
            subcategoryName: subCategory?.name || null,
            subcategoryCode: subCategory?.code || null
          };

          return dispatchAction(updatedCourse)
            .toPromise()
            .then(_ => modal.destroy());
        }
      }]
    });
    const instance = modal.getContentComponent();
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));

    instance.addNewCategory
      .pipe(takeUntil(modalDestroyed$))
      .subscribe(res => {
        modal.close();
        this.createCategory<T, A>(course, categoryDictionary, dispatchAction);
      });

    instance.addNewSubCategory
      .pipe(takeUntil(modalDestroyed$))
      .subscribe(res => {
        modal.close();
        this.createSubCategory<T, A>(
          course,
          res.category,
          categoryDictionary,
          dispatchAction,
          res.subCategories
        );
      });

    instance.categoryControl.valueChanges
      .pipe(
        switchMap((category: ILTCourseCategory) => this.lmsSubCategoriesService.getLMSSubCategories(category.id)),
        takeUntil(modalDestroyed$)
      ).subscribe((resource: DeferredResource<CourseSubCategory[]>) => {
        if (resource.isSuccess) {
          const dict = resource.response;
          const currentSubcategory = instance.subCategoryControl.value;

          instance.subCategoryDictionary = dict;

          instance.subCategoryControl.patchValue(
            currentSubcategory && dict.find(x => x.code === currentSubcategory.code)
              ? currentSubcategory
              : null
          );
        }
      });
  }

  private createCategory<T, A>(
    course: T,
    categoryDictionary: CourseCategory[],
    dispatchAction: (updatedCourse: T) => Observable<A>,
  ): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Create Category',
      nzContent: CreateCategoryModalComponent,
      nzComponentParams: {
        categoryDictionary,
        minLength: 6
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [{
        label: 'Cancel',
        type: 'text',
        onClick: () => {
          modal.destroy();
        }
      }, {
        label: 'Save Changes',
        type: 'primary',
        disabled: (d) => !d.form.valid || d.form.pristine,
        onClick: (data) => {
          const formValue = data.form.getRawValue();

          return this.lmsCategoriesService.createLMSCategory(formValue.name, formValue.description)
            .pipe(
              filter((resource) => resource.isSuccess),
              map(((resource) => {
                const createdCategory = resource.response;
                const updatedCategoryDictionary = [...categoryDictionary, createdCategory];
                const updatedCourse = {
                  ...course,
                  categoryId: createdCategory.id,
                  categoryCode: createdCategory.code,
                  categoryName: createdCategory.name,
                  subcategoryId: null,
                  subcategoryCode: null,
                  subcategoryName: null
                };

                return { updatedCourse, updatedCategoryDictionary };
              })))
            .toPromise()
            .then((result) => {
              modal.close();
              this.editCategory(result.updatedCourse, result.updatedCategoryDictionary, dispatchAction);
            });
        }
      }]
    });
  }

  private createSubCategory<T, A>(course: T,
    category: CourseCategory,
    categoryDictionary: CourseCategory[],
    dispatchAction: (updatedCourse: T) => Observable<A>,
    subCategoryDictionary: CourseSubCategory[]
  ): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'New Sub-Category',
      nzContent: CreateSubCategoryModalComponent,
      nzComponentParams: {
        category,
        subCategoryDictionary,
        minLength: 6
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [{
        label: 'Cancel',
        type: 'text',
        onClick: () => {
          modal.destroy();
        }
      }, {
        label: 'Save Changes',
        type: 'primary',
        disabled: (d) => !d.form.valid || d.form.pristine,
        onClick: (data) => {
          const formValue = data.form.getRawValue();
          const payload = {
            name: formValue.name,
            category: { id: category.id },
            description: formValue.description,
            keywords: formValue.keywords
          };

          return this.lmsSubCategoriesService.createLMSSubCategory(payload)
            .pipe(
              filter((resource) => resource.isSuccess),
              map((resource) => {
                const createdSubCategory = resource.response;
                const updatedSubCategoryDictionary = [...subCategoryDictionary, createdSubCategory];
                const updatedCourse = {
                  ...course,
                  categoryId: category.id,
                  categoryName: category.name,
                  categoryCode: category.code,
                  subcategoryId: createdSubCategory.id,
                  subcategoryCode: createdSubCategory.code,
                  subcategoryName: createdSubCategory.name
                };

                return { updatedSubCategoryDictionary, updatedCourse };
              })
            )
            .toPromise()
            .then(result => {
              modal.close();
              this.editCategory(
                result.updatedCourse,
                categoryDictionary,
                dispatchAction,
                result.updatedSubCategoryDictionary
              );
            });
        }
      }]
    });
    const instance = modal.getContentComponent();
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));

    instance.searchKeywords
      .pipe(takeUntil(modalDestroyed$))
      .subscribe((search: string) => {
        instance.keywordsControlOptions$ = this.adminCoursesService.getAgoraKeywords(search)
          .pipe(map(t => t.data));
      });
  }
}
