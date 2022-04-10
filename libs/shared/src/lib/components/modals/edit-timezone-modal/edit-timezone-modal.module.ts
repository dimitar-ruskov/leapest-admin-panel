import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditTimezoneModalComponent} from "./edit-timezone-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormLabelModule} from "../../common/form-label/form-label.module";

@NgModule({
  declarations: [EditTimezoneModalComponent],
  exports: [EditTimezoneModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzSelectModule
  ],
})
export class EditTimezoneModalModule {}
