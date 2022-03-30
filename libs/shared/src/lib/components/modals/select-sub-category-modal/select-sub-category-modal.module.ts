import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {SelectSubCategoryModalComponent} from "./select-sub-category-modal.component";

import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [SelectSubCategoryModalComponent],
  exports: [SelectSubCategoryModalComponent],
  imports: [
    CommonModule,
    FormsModule,

    NzInputModule
  ],
})
export class SelectSubCategoryModalModule {}
