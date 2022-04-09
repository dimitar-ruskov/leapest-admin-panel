import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

import { SelectSubCategoryInputComponent } from './select-sub-category-input.component';
import {SelectSubCategoryModalModule} from "../../modals/select-sub-category-modal/select-sub-category-modal.module";

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [SelectSubCategoryInputComponent],
  exports: [
    SelectSubCategoryInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SelectSubCategoryModalModule,

    NzSelectModule,
    NzButtonModule
  ]
})
export class SelectSubCategoryInputModule { }
