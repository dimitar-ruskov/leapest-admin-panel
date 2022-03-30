import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditLanguageModalComponent} from "./edit-language-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [EditLanguageModalComponent],
  exports: [EditLanguageModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule
  ],
})
export class EditLanguageModalModule {}
