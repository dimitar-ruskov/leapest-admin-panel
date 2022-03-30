import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {KeywordsInputModalComponent} from "./keywords-input-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTagModule} from "ng-zorro-antd/tag";

@NgModule({
  declarations: [KeywordsInputModalComponent],
  exports: [KeywordsInputModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzSelectModule,
    NzTagModule
  ],
})
export class KeywordsInputModalModule {}
