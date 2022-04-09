import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  OnChanges,
  SimpleChanges,
  Input,
  ChangeDetectorRef,
  TrackByFunction,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { filter, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  SelectSubCategoryModalComponent
} from "../../modals/select-sub-category-modal/select-sub-category-modal.component";

import {LmsSubCategoriesService} from "../../../utils/services";
import {CourseSubCategory} from "../../../models/interfaces";

@Component({
  selector: 'leap-select-sub-category-input',
  templateUrl: './select-sub-category-input.component.html',
  styleUrls: ['./select-sub-category-input.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSubCategoryInputComponent),
      multi: true,
    },
  ],
})
@UntilDestroy()
export class SelectSubCategoryInputComponent implements OnChanges, ControlValueAccessor {
  isDisabled: boolean;
  subCategory: CourseSubCategory;
  subCategoryId: string;
  subCategories: CourseSubCategory[] = [];

  @Input() categoryId: string;

  private onChange: (value: CourseSubCategory | null) => void = () => {};
  private onTouched: () => void = () => {};

  trackByFn: TrackByFunction<CourseSubCategory> = (index, item) => item.id;

  constructor(
    private readonly modalService: NzModalService,
    private readonly lmsSubCategoriesService: LmsSubCategoriesService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  registerOnChange(fn: (value: CourseSubCategory | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(subCategory: CourseSubCategory): void {
    this.updateSelectedSubcategory(subCategory);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.categoryId && changes.categoryId.currentValue !== changes.categoryId.previousValue) {
      this.lmsSubCategoriesService
        .getLMSSubCategories(changes.categoryId.currentValue)
        .pipe(untilDestroyed(this))
        .subscribe((resource) => {
          if (resource.isSuccess) {
            this.subCategories = resource.response;
            this.cdr.markForCheck();
          }
        });
      this.updateSelectedSubcategory(null);
      this.onChange(null);
    }
  }

  openSubCategoryModal(): void {
    this.modalService.create({
      nzTitle: 'Create New Sub-Category',
      nzContent: SelectSubCategoryModalComponent,
      nzOkText: 'Add Sub-Category',
      nzOkDisabled: true,
      nzOnOk: async (content) => {
        return this.createSubCategory(content.newSubCategoryName).toPromise();
      },
    });
  }

  onSubCategorySelected(selectedSubCategoryId: string): void {
    const selectedSubCategory = this.subCategories.find((c) => c.id === selectedSubCategoryId);

    this.updateSelectedSubcategory(selectedSubCategory);
    this.onChange(selectedSubCategory);
    this.cdr.markForCheck();
  }

  private createSubCategory(newSubCategoryName: string): Observable<any> {
    return this.lmsSubCategoriesService
      .createLMSSubCategory({
        name: newSubCategoryName,
        category: { id: this.categoryId },
      })
      .pipe(
        filter((resource) => resource.isSuccess),
        map((resource) => resource.response),
        tap((createdSubCategory) => {
          this.subCategories = [...this.subCategories, createdSubCategory];
          this.updateSelectedSubcategory(createdSubCategory);
          this.cdr.markForCheck();
          this.onChange(createdSubCategory);
        }),
      );
  }

  private updateSelectedSubcategory(subCategory: CourseSubCategory): void {
    this.subCategory = subCategory;
    this.subCategoryId = subCategory?.id || null;
  }
}
