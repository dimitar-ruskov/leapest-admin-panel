import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGuidanceComponent} from "./form-guidance.component";

@NgModule({
  declarations: [FormGuidanceComponent],
  exports: [FormGuidanceComponent],
  imports: [
    CommonModule
  ]
})
export class FormGuidanceModule { }
