import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";

import {InstructorCreateModalComponent} from "./instructor-create-modal.component";
import {
  FormLabelModule
} from "../../common/form-label/form-label.module";

@NgModule({
  declarations: [InstructorCreateModalComponent],
  exports: [InstructorCreateModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzInputModule,
  ]
})
export class InstructorCreateModalModule {}
