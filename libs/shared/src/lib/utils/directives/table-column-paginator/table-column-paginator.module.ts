import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumnPaginatorDirective } from './table-column-paginator.directive';

@NgModule({
  declarations: [TableColumnPaginatorDirective],
  imports: [CommonModule],
  exports: [TableColumnPaginatorDirective],
})
export class TableColumnPaginatorModule {}
