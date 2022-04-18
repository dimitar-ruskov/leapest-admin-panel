import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzUploadModule} from "ng-zorro-antd/upload";

import {BulkUploadModalComponent} from "./bulk-upload-modal.component";
import {
  FormLabelModule
} from "../../common/form-label/form-label.module";

@NgModule({
  declarations: [BulkUploadModalComponent],
  exports: [BulkUploadModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzButtonModule,
    NzUploadModule
  ],
})
export class BulkUploadModalModule {}
