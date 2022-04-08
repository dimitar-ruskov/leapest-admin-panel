import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {EditorCharCountModule} from "../../common/editor-char-count/editor-char-count.module";
import {QuillInputModalComponent} from "./quill-input-modal.component";

@NgModule({
  declarations: [QuillInputModalComponent],
  exports: [QuillInputModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormLabelModule,
    EditorCharCountModule,
    QuillModule,
    NzFormModule,
  ],
})
export class QuillInputModalModule {}
