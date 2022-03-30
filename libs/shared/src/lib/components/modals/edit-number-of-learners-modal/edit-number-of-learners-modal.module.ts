import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditNumberOfLearnersModalComponent} from "./edit-number-of-learners-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";

@NgModule({
  declarations: [EditNumberOfLearnersModalComponent],
  exports: [EditNumberOfLearnersModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputNumberModule
  ],
})
export class EditNumberOfLearnersModalModule {}
