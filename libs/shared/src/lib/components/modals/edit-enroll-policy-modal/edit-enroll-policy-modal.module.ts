import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditEnrollPolicyModalComponent} from "./edit-enroll-policy-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzRadioModule} from "ng-zorro-antd/radio";

@NgModule({
  declarations: [EditEnrollPolicyModalComponent],
  exports: [EditEnrollPolicyModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzRadioModule
  ],
})
export class EditEnrollPolicyModalModule {}
