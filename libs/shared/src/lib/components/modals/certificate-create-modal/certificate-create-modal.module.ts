import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NzFormModule} from "ng-zorro-antd/form";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";

import {
  FormLabelModule
} from "../../common/form-label/form-label.module";
import {CertificateCreateModalComponent} from "./certificate-create-modal.component";
import {CertificateUploadFileModule} from "../../feature/certificate-upload-file/certificate-upload-file.module";

@NgModule({
  declarations: [CertificateCreateModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    CertificateUploadFileModule,

    NzFormModule,
    NzCheckboxModule,
    NzLayoutModule,
    NzInputModule,
    NzInputNumberModule
  ]
})
export class CertificateCreateModalModule {}
