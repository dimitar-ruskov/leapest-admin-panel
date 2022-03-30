import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'td[leap-table-grid-title-cell]',
  templateUrl: './table-grid-title-cell.component.html',
  styleUrls: ['./table-grid-title-cell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableGridTitleCellComponent {
  @HostBinding('class.leap-table-grid__title-cell') className = true;
}
