import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditAttendanceTrackingSettingsModalComponent} from "./edit-attendance-tracking-settings-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";

@NgModule({
  declarations: [EditAttendanceTrackingSettingsModalComponent],
  exports: [EditAttendanceTrackingSettingsModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzRadioModule,
    NzInputNumberModule
  ],
})
export class EditAttendanceTrackingSettingsModalModule {}
