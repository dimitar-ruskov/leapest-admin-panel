import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableSearchComponent } from './table-search.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    TableSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    NzInputModule,
    NzIconModule
  ],
  exports: [
    TableSearchComponent
  ]
})
export class TableSearchModule { }
