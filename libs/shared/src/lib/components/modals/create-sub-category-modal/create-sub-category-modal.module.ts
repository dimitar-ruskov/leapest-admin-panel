import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";

import {CreateSubCategoryModalComponent} from "./create-sub-category-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTagModule} from "ng-zorro-antd/tag";

@NgModule({
  declarations: [CreateSubCategoryModalComponent],
  exports: [CreateSubCategoryModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,

    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule
  ],
})
export class CreateSubCategoryModalModule {}
