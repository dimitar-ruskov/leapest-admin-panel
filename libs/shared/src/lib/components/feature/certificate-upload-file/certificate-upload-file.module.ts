import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NzFormModule} from "ng-zorro-antd/form";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzAlertModule} from "ng-zorro-antd/alert";

import {
  FormLabelModule
} from "../../common/form-label/form-label.module";

import {CertificateUploadFileComponent} from "./certificate-upload-file.component";


@NgModule({
  declarations: [CertificateUploadFileComponent],
  exports: [CertificateUploadFileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzUploadModule,
    NzButtonModule,
    NzSpinModule,
    NzAlertModule
  ]
})
export class CertificateUploadFileModule {}
