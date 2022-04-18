import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  TrackByFunction
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {CourseCategory, CourseSubCategory} from "../../../models";

@Component({
  selector: 'leap-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCategoryModalComponent implements OnInit {

  form: FormGroup = this.fb.group({
    category: [null, [Validators.required]],
    subCategory: [null]
  });

  @Input() selectedCategory: CourseCategory | null;
  @Input() selectedSubCategory: CourseSubCategory | null;

  @Input() categoryDictionary: CourseCategory[];
  @Input() subCategoryDictionary: CourseSubCategory[];

  @Output() addNewCategory = new EventEmitter<void>();
  @Output() addNewSubCategory = new EventEmitter<{ category: CourseCategory, subCategories: CourseSubCategory[] }>();

  get categoryControl(): FormControl {
    return this.form.get('category') as FormControl;
  }

  get subCategoryControl(): FormControl {
    return this.form.get('subCategory') as FormControl;
  }

  trackByFn: TrackByFunction<CourseCategory | CourseSubCategory> = (index, item) => item.id;

  categoryCompareFn = (c1: CourseCategory, c2: CourseCategory): boolean => {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  subCategoryCompareFn = (c1: CourseSubCategory, c2: CourseSubCategory): boolean => {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  constructor(private readonly fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.form.patchValue({
      category: this.selectedCategory,
      subCategory: this.selectedSubCategory
    });
  }

  onAddNewSubCategory(): void {
    this.addNewSubCategory.emit({
      category: this.form.get('category').value,
      subCategories: this.subCategoryDictionary
    });
  }
}
