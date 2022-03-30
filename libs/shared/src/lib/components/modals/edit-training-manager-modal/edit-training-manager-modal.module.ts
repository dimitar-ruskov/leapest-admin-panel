import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditTrainingManagerModalComponent} from "./edit-training-manager-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [EditTrainingManagerModalComponent],
  exports: [EditTrainingManagerModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule
  ],
})
export class EditTrainingManagerModalModule {}
