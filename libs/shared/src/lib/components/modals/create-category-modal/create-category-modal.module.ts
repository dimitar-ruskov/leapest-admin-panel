import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";

import {CreateCategoryModalComponent} from "./create-category-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {EditorCharCountModule} from "../../common/editor-char-count/editor-char-count.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [CreateCategoryModalComponent],
  exports: [CreateCategoryModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    QuillModule,
    FormLabelModule,
    EditorCharCountModule,
    NzFormModule,
    NzInputModule,
  ],
})
export class CreateCategoryModalModule {}
