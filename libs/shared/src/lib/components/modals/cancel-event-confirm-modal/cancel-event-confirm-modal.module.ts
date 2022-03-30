import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {CancelEventConfirmModalComponent} from "./cancel-event-confirm-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [CancelEventConfirmModalComponent],
  exports: [CancelEventConfirmModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputModule
  ],
})
export class CancelEventConfirmModalModule {}
