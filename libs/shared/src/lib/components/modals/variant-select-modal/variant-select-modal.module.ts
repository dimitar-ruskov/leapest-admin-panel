import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {VariantSelectModalComponent} from "./variant-select-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [VariantSelectModalComponent],
  exports: [VariantSelectModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule
  ],
})
export class VariantSelectModalModule {}
