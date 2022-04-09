import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditLevelModalComponent} from "./edit-level-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@NgModule({
  declarations: [EditLevelModalComponent],
  exports: [EditLevelModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzRadioModule,
    NzToolTipModule
  ],
})
export class EditLevelModalModule {}
