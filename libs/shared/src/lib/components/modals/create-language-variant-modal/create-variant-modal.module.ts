import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";

import {
  FormLabelModule
} from "../../common/form-label/form-label.module";
import {CreateVariantModalComponent} from "./create-variant-modal.component";

@NgModule({
  declarations: [CreateVariantModalComponent],
  exports: [CreateVariantModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzLayoutModule,
    NzFormModule,
    NzSelectModule
  ]
})
export class CreateVariantModalModule { }
