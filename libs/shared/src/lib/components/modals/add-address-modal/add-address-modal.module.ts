import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {AddAddressModalComponent} from "./add-address-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [AddAddressModalComponent],
  exports: [AddAddressModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzSelectModule,
    NzFormModule,
    NzInputModule
  ],
})
export class AddAddressModalModule {}
