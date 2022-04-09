import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {SelectSubCategoryModalComponent} from "./select-sub-category-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [SelectSubCategoryModalComponent],
  exports: [SelectSubCategoryModalComponent],
  imports: [
    CommonModule,
    FormsModule,

    FormLabelModule,
    NzInputModule
  ],
})
export class SelectSubCategoryModalModule {}
