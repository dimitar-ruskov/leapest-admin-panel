import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {BulkAttendanceTrackingSelectionModalComponent} from "./bulk-attendance-tracking-selection-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [BulkAttendanceTrackingSelectionModalComponent],
  exports: [BulkAttendanceTrackingSelectionModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzAlertModule,
    NzSpinModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSelectModule,
  ],
})
export class BulkAttendanceTrackingSelectionModalModule {}
