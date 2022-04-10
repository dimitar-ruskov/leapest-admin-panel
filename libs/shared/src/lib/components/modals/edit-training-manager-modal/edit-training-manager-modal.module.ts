import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditTrainingManagerModalComponent} from "./edit-training-manager-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [EditTrainingManagerModalComponent],
  exports: [EditTrainingManagerModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,

    NzFormModule,
    NzSelectModule
  ],
})
export class EditTrainingManagerModalModule {}
