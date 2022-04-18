import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

import { CourseCategory } from "../../../models";
import { LmsCategoriesService } from "../../../services/courses/lms-categories.service";

@Component({
  selector: 'leap-select-category-modal',
  templateUrl: './select-category-modal.component.html',
  styleUrls: ['./select-category-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SelectCategoryModalComponent implements OnInit {
  creatingCategory: boolean;
  newCategoryName: string;

  @Input() mode: 'select' | 'create' = 'select';
  @Input() categoryDictionary: CourseCategory[];

  trackByFn: TrackByFunction<CourseCategory> = (index, item) => item.id;

  constructor(private readonly modalRef: NzModalRef, private readonly lmsCategoriesService: LmsCategoriesService) {}

  ngOnInit(): void {
    this.lmsCategoriesService
      .getLMSCategories()
      .pipe(untilDestroyed(this))
      .subscribe((resource) => {
        if (resource.isSuccess) {
          this.categoryDictionary = resource.response;
        }
      });
  }

  onCategorySelect(category: CourseCategory): void {
    this.modalRef.close(prepareCategory(category));
  }

  createCategory(): void {
    this.lmsCategoriesService
      .createLMSCategory(this.newCategoryName)
      .pipe(untilDestroyed(this))
      .subscribe((resource) => {
        this.creatingCategory = resource.isPending;

        if (resource.isSuccess) {
          this.modalRef.close(prepareCategory(resource.response));
        }
      });
  }

  switchToSelectMode(): void {
    this.mode = 'select';
    this.newCategoryName = '';
  }

  switchToCreateMode(): void {
    this.mode = 'create';
  }

  onCancel(): void {
    this.modalRef.destroy();
  }
}

function prepareCategory(category): CourseCategory {
  return {
    id: category.id,
    name: category.name,
    code: category.code,
  };
}
