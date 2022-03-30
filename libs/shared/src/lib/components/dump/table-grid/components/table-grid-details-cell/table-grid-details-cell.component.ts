import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'td[leap-table-grid-details-cell]',
  templateUrl: './table-grid-details-cell.component.html',
  styleUrls: ['./table-grid-details-cell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableGridDetailsCellComponent {
  @HostBinding('class.leap-table-grid__details-cell') className = true;
}
