import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";
import {NzFormModule} from "ng-zorro-antd/form";
import {QuillInputModalComponent} from "./quill-input-modal.component";

@NgModule({
  declarations: [QuillInputModalComponent],
  exports: [QuillInputModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,
    NzFormModule,
  ],
})
export class QuillInputModalModule {}
