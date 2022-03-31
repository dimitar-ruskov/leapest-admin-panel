import { AfterViewInit, Directive, ElementRef, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { TableGridRowDirective } from './table-grid-row.directive';


@Directive({
  selector: '[leapTableGridCellTooltip]'
})
export class TableGridCellTooltipDirective implements AfterViewInit, OnDestroy {

  constructor(@Optional() @SkipSelf() private tableRow: TableGridRowDirective,
              private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    if (this.tableRow) {
      this.tableRow.registerNestedTooltipOrigin(this.elementRef);
    }
  }

  ngOnDestroy(): void {
    if (this.tableRow) {
      this.tableRow.unregisterNestedTooltipOrigin(this.elementRef);
    }
  }
}
