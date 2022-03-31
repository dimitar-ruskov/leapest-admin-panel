import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TableGridDirective } from './directives/table-grid.directive';
import { TableGridRowTooltipDirective } from './directives/table-grid-row-tooltip.directive';
import { TableGridRowDirective } from './directives/table-grid-row.directive';
import { TableGridCellTooltipDirective } from './directives/table-grid-cell-tooltip.directive';
import { TableGridRowCtaButtonDirective } from './directives/table-grid-row-cta-button.directive';
import { TableGridSpacerDirective } from './directives/table-grid-spacer.directive';
import { TableGridDetailsCellComponent } from './components/table-grid-details-cell/table-grid-details-cell.component';
import { TableGridTitleCellComponent } from './components/table-grid-title-cell/table-grid-title-cell.component';


@NgModule({
  declarations: [
    TableGridDirective,
    TableGridTitleCellComponent,
    TableGridDetailsCellComponent,
    TableGridSpacerDirective,
    TableGridRowTooltipDirective,
    TableGridRowDirective,
    TableGridCellTooltipDirective,
    TableGridRowCtaButtonDirective
  ],
  imports: [
    CommonModule,
    NzTableModule
  ],
  exports: [
    TableGridDirective,
    TableGridTitleCellComponent,
    TableGridDetailsCellComponent,
    TableGridSpacerDirective,
    TableGridRowTooltipDirective,
    TableGridRowDirective,
    TableGridCellTooltipDirective,
    TableGridRowCtaButtonDirective
  ]
})
export class TableGridModule { }
