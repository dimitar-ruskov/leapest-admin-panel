import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";

import {CreateSubCategoryModalComponent} from "./create-sub-category-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {EditorCharCountModule} from "../../common/editor-char-count/editor-char-count.module";

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

    EditorCharCountModule,
    FormLabelModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule
  ],
})
export class CreateSubCategoryModalModule {}
