import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectCategoryInputComponent } from './select-category-input.component';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [
    SelectCategoryInputComponent,
  ],
  exports: [
    SelectCategoryInputComponent,
  ],
  imports: [
    CommonModule,
    NzButtonModule
  ]
})
export class SelectCategoryInputModule { }
