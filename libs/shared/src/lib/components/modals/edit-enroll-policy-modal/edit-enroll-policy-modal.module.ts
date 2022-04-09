import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditEnrollPolicyModalComponent} from "./edit-enroll-policy-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzRadioModule} from "ng-zorro-antd/radio";

@NgModule({
  declarations: [EditEnrollPolicyModalComponent],
  exports: [EditEnrollPolicyModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzRadioModule
  ],
})
export class EditEnrollPolicyModalModule {}
