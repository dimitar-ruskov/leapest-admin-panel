import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditCategoryModalComponent} from "./edit-category-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
  declarations: [EditCategoryModalComponent],
  exports: [EditCategoryModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule,
    NzButtonModule
  ],
})
export class EditCategoryModalModule {}
