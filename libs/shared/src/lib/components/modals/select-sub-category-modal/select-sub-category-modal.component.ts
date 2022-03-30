import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';


@Component({
  selector: 'leap-select-sub-category-modal',
  templateUrl: './select-sub-category-modal.component.html',
  styleUrls: ['./select-sub-category-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSubCategoryModalComponent {
  newSubCategoryName: string;

  constructor(private readonly modalRef: NzModalRef) {
  }

  onValueChange(value: string) {
    this.updateAddButtonDisabled(!value.trim().length);
  }

  private updateAddButtonDisabled(disabled: boolean): void {
    this.modalRef.updateConfig({
      nzOkDisabled: disabled
    });
  }
}
