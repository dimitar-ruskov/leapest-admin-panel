import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {SelectInputModalComponent} from "./select-input-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [SelectInputModalComponent],
  exports: [SelectInputModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule
  ],
})
export class SelectInputModalModule {}
