import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditInstructorsModalComponent} from "./edit-instructors-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {
  InstructorsCollisionsWarningsModule
} from "../../feature/instructors-collisions-warnings/instructors-collisions-warnings.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  declarations: [EditInstructorsModalComponent],
  exports: [EditInstructorsModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    InstructorsCollisionsWarningsModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzSpinModule
  ],
})
export class EditInstructorsModalModule {}
