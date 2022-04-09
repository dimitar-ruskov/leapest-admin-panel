import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditExternalSKUModalComponent} from "./edit-external-sku-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [EditExternalSKUModalComponent],
  exports: [EditExternalSKUModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzInputModule
  ],
})
export class EditExternalSkuModalModule {}
