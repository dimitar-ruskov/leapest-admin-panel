import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {ISearchMetadata, ISearchParams} from "../../../models/notifications/notifications.model";

@Component({
  selector: 'leap-notification-filter-pills',
  templateUrl: './notification-filter-pills.component.html',
  styleUrls: ['./notification-filter-pills.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationFilterPillsComponent {
  @Input() searchMetadata: ISearchMetadata;
  @Input() searchForm: any;
  @Input() filters: { [key in keyof any]: any[] };

  @Output() filterPatched = new EventEmitter<Partial<ISearchParams>>();
  @Output() filtersRemoved = new EventEmitter<void>();

  constructor() {}

  get displayPills(): boolean {
    const arr = Object.entries(this.searchForm);
    if (!arr.length) {
      return false;
    }
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i][1];
      if (!value) {
        continue;
      }
      if ((typeof value === 'string' && !!value) || (value instanceof Array && value.length)) {
        return true;
      }
    }
    return false;
  }

  public removeFilter(filter: keyof any): void {
    this.filterPatched.emit({ [filter]: undefined });
  }

  public clearFilters(): void {
    this.filtersRemoved.emit();
  }

  public removeArrayItem(filter: keyof any, item: string): void {
    const array = this.searchForm[filter];
    if (array instanceof Array) {
      const pos = array.findIndex((i) => i === item);
      if (pos > -1) {
        const newArray = array.slice();
        newArray.splice(pos, 1);
        this.filterPatched.emit({ [filter]: newArray });
      }
    }
  }
}
