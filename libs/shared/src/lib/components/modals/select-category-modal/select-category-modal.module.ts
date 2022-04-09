import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {SelectCategoryModalComponent} from "./select-category-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [SelectCategoryModalComponent],
  exports: [SelectCategoryModalComponent],
  imports: [
    CommonModule,
    FormsModule,

    FormLabelModule,
    NzButtonModule,
    NzInputModule
  ],
})
export class SelectCategoryModalModule {}
