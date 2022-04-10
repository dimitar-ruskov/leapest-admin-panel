import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditAddressModalComponent} from "./edit-address-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzAlertModule} from "ng-zorro-antd/alert";

@NgModule({
  declarations: [EditAddressModalComponent],
  exports: [EditAddressModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzButtonModule,
    NzSpinModule,
    NzSelectModule,
    NzAlertModule
  ],
})
export class EditAddressModalModule {}
