import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditPassRateModalComponent} from "./edit-pass-rate-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";

@NgModule({
  declarations: [EditPassRateModalComponent],
  exports: [EditPassRateModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputNumberModule
  ],
})
export class EditPassRateModalModule {}
