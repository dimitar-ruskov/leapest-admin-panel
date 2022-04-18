import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NzFormModule} from "ng-zorro-antd/form";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";

import {EditCertificatePeriodComponent} from "./edit-certificate-period.component";
import {
  FormLabelModule
} from "../../common/form-label/form-label.module";

@NgModule({
  declarations: [EditCertificatePeriodComponent],
  exports: [EditCertificatePeriodComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputNumberModule
  ]
})
export class EditCertificatePeriodModule {}
