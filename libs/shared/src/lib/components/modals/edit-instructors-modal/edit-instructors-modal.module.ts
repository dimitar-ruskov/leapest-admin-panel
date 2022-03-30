import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditInstructorsModalComponent} from "./edit-instructors-modal.component";

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

    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzSpinModule
  ],
})
export class EditInstructorsModalModule {}
