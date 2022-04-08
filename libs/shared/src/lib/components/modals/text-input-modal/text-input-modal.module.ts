import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {TextInputModalComponent} from "./text-input-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [TextInputModalComponent],
  exports: [TextInputModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,

    NzFormModule,
    NzInputModule
  ],
})
export class TextInputModalModule {}
