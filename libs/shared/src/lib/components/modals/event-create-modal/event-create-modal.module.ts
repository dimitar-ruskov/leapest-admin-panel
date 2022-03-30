import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EventCreateModalComponent} from "./event-create-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzRadioModule} from "ng-zorro-antd/radio";

@NgModule({
  declarations: [EventCreateModalComponent],
  exports: [EventCreateModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule,
    NzRadioModule
  ],
})
export class EventCreateModalModule {}
