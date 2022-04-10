import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ChangeDraftILTEventsPaginationParams, GetDraftILTEvents, ResetDraftILTEventsState } from './state/draft-ilt-events.actions';
import { DraftIltEventsState } from './state/draft-ilt-events.state';
import {IFilterSelectedDates, ILTEventListItem} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  createFiltersFromDateRangeSelect,
  createPageableFromTableQueryParams
} from "../../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-draft-ilt-events-list',
  templateUrl: './draft-ilt-events-list.component.html',
  styleUrls: ['./draft-ilt-events-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class DraftIltEventsListComponent implements OnInit {

  @Select(DraftIltEventsState.loading)
  loading$: Observable<boolean>;

  @Select(DraftIltEventsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(DraftIltEventsState.iltEvents)
  iltEvents$: Observable<ILTEventListItem[]>;

  @Select(DraftIltEventsState.pageSize)
  pageSize$: Observable<number>;

  @Select(DraftIltEventsState.total)
  total$: Observable<number>;

  @Select(DraftIltEventsState.pageIndex)
  pageIndex$: Observable<number>;

  public datePickerRangeControl: FormControl = new FormControl('');
  private filterSelectedDates: IFilterSelectedDates[];

  trackByFn: TrackByFunction<ILTEventListItem> = (index, item) => item.id;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ResetDraftILTEventsState());
    this.onFilterSelectedDatesChange();
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    if (this.filterSelectedDates) {
      pageable.filterParams = [...pageable.filterParams, ...this.filterSelectedDates];
    }

    this.store.dispatch([
      new ChangeDraftILTEventsPaginationParams({ pageable }),
      new GetDraftILTEvents()
    ]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeDraftILTEventsPaginationParams({ pageable: { filter: searchPhrase, page: 1, filterParams: this.filterSelectedDates }}),
      new GetDraftILTEvents()
    ]);
  }

  private onFilterSelectedDatesChange(): void {
    this.datePickerRangeControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((selectedRanges) => {
      this.filterSelectedDates = createFiltersFromDateRangeSelect(selectedRanges);

      this.store.dispatch([
        new ChangeDraftILTEventsPaginationParams({ pageable: { filterParams: this.filterSelectedDates }}),
        new GetDraftILTEvents(),
      ]);
    });
  }

}
