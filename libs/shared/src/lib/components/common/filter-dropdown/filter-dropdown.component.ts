import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FilterParamList} from "../../../utils/services";

@Component({
  selector: 'leap-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.less'],
})
export class FilterDropdownComponent {
  @Input() filterList: FilterParamList[];
  @Output() filterUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  get resetDisabled(): boolean {
    return !this.filterList.some((x) => x.selected);
  }

  public itemChanged(value: boolean, item?: FilterParamList) {
    item.selected = value;
  }

  public resetFilter(): void {
    this.filterList.forEach((x) => (x.selected = false));
    this.setFilters();
  }

  public setFilters(): void {
    this.filterUpdated.emit();
  }
}
