import { Component, ChangeDetectionStrategy, Input, forwardRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseCategory } from '../../models/course-category.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SelectCategoryModalComponent } from '../../modals/select-category-modal/select-category-modal.component';
import { LmsCategoriesService } from '../../services/lms-categories.service';


@Component({
  selector: 'leap-select-category-input',
  templateUrl: './select-category-input.component.html',
  styleUrls: ['./select-category-input.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCategoryInputComponent),
      multi: true
    }
  ]
})
export class SelectCategoryInputComponent implements OnInit, ControlValueAccessor {

  isDisabled: boolean;
  category: CourseCategory;
  categoryDictionary: CourseCategory[] = [];

  @Input() categoryLabel = 'Category';

  private onChange: (value: CourseCategory | null) => void = () => {};
  private onTouched = () => {};

  constructor(private readonly modalService: NzModalService,
              private readonly lmsCategoriesService: LmsCategoriesService,
              private readonly cdr: ChangeDetectorRef) {
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(category: CourseCategory | null): void {
    this.category = category;
  }

  ngOnInit(): void {
    this.lmsCategoriesService.getLMSCategories()
      .subscribe((resource) => {
        if (resource.isSuccess) {
          this.categoryDictionary = resource.response;
        }
      });
  }

  openSelectCategoryModal(event: MouseEvent): void {
    event.stopPropagation();
    const modal = this.modalService.create({
      nzTitle: 'Select Category',
      nzComponentParams: {
        categoryDictionary: this.categoryDictionary
          .filter((category) => this.category?.id !== category.id)
      },
      nzWidth: '660px',
      nzContent: SelectCategoryModalComponent,
      nzFooter: null
    });

    modal.afterClose.asObservable()
      .subscribe((category: CourseCategory) => {
        if (category) {
          const categoryIndex = this.categoryDictionary.findIndex((c) => c.id === category.id);

          if (categoryIndex === -1) {
            this.categoryDictionary.push(category);
          }

          this.selectCategory(category);
          modal.destroy();
        }
      });
  }

  resetSelectedCategory(event: MouseEvent): void {
    event.stopPropagation();
    this.selectCategory(null);
  }

  private selectCategory(category: CourseCategory | null): void {
    this.category = category;
    this.onChange(category);
    this.cdr.markForCheck();
  }
}
