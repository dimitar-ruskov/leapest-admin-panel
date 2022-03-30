import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";

import {CreateCategoryModalComponent} from "./create-category-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [CreateCategoryModalComponent],
  exports: [CreateCategoryModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    QuillModule,

    NzFormModule,
    NzInputModule,
  ],
})
export class CreateCategoryModalModule {}
