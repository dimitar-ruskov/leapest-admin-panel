import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NzTableQueryParams } from "ng-zorro-antd/table";

import {
  ChangeFinishedILTEventsPaginationParams,
  GetFinishedILTEvents,
  ResetFinishedILTEventsState
} from "./state/finished-ilt-events.actions";
import { FinishedIltEventsState } from "./state/finished-ilt-events.state";

import { IFilterSelectedDates, ILTEventListItem } from "../../../../../../../../../libs/shared/src/lib/models";
import {
  createFiltersFromDateRangeSelect,
  createPageableFromTableQueryParams
} from "../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-finished-ilt-events-list',
  templateUrl: './finished-ilt-events-list.component.html',
  styleUrls: ['./finished-ilt-events-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class FinishedIltEventsListComponent implements OnInit {

  @Select(FinishedIltEventsState.loading)
  loading$: Observable<boolean>;

  @Select(FinishedIltEventsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(FinishedIltEventsState.iltEvents)
  iltEvents$: Observable<ILTEventListItem[]>;

  @Select(FinishedIltEventsState.pageSize)
  pageSize$: Observable<number>;

  @Select(FinishedIltEventsState.total)
  total$: Observable<number>;

  @Select(FinishedIltEventsState.pageIndex)
  pageIndex$: Observable<number>;

  public datePickerRangeControl: FormControl = new FormControl('');
  private filterSelectedDates: IFilterSelectedDates[];

  trackByFn: TrackByFunction<ILTEventListItem> = (index, item) => item.id;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ResetFinishedILTEventsState());
    this.onFilterSelectedDatesChange();
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    if (this.filterSelectedDates) {
      pageable.filterParams = [...pageable.filterParams, ...this.filterSelectedDates];
    }

    this.store.dispatch([
      new ChangeFinishedILTEventsPaginationParams({ pageable }),
      new GetFinishedILTEvents()
    ]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeFinishedILTEventsPaginationParams({ pageable: { filter: searchPhrase, page: 1, filterParams: this.filterSelectedDates }}),
      new GetFinishedILTEvents()
    ]);
  }

  private onFilterSelectedDatesChange(): void {
    this.datePickerRangeControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((selectedRanges) => {
      this.filterSelectedDates = createFiltersFromDateRangeSelect(selectedRanges);

      this.store.dispatch([
        new ChangeFinishedILTEventsPaginationParams({ pageable: { filterParams: this.filterSelectedDates }}),
        new GetFinishedILTEvents(),
      ]);
    });
  }

}
