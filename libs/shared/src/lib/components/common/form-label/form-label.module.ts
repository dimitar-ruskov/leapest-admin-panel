import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLabelComponent } from './form-label/form-label.component';
import { FormHintLabelComponent } from './form-hint-label/form-hint-label.component';


@NgModule({
  declarations: [
    FormLabelComponent,
    FormHintLabelComponent
  ],
  exports: [
    FormLabelComponent,
    FormHintLabelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FormLabelModule { }
