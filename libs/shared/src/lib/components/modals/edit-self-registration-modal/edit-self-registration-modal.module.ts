import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditSelfRegistrationModalComponent} from "./edit-self-registration-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";

@NgModule({
  declarations: [EditSelfRegistrationModalComponent],
  exports: [EditSelfRegistrationModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTimePickerModule
  ],
})
export class EditSelfRegistrationModalModule {}
