import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {TFormControlComponent} from "./t-form-control.component";

import {QuillModule} from "ngx-quill";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzRadioModule} from "ng-zorro-antd/radio";

@NgModule({
  declarations: [TFormControlComponent],
  exports: [TFormControlComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    QuillModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzRadioModule,
  ]
})
export class TFormControlModule { }
