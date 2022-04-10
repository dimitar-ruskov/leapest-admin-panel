import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import {
  CancelILTEvent,
  ChangeActiveILTEventsPaginationParams,
  GetActiveILTEvents,
  ResetActiveILTEventsState,
} from './state/active-ilt-events.actions';
import { ActiveIltEventsState } from './state/active-ilt-events.state';
import {IFilterSelectedDates, ILTEventListItem} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  createFiltersFromDateRangeSelect,
  createPageableFromTableQueryParams
} from "../../../../../../../../../libs/shared/src/lib/utils/common";

import {
  CancelEventConfirmModalComponent
} from "../../../../../../../../../libs/shared/src/lib/components/modals/cancel-event-confirm-modal/cancel-event-confirm-modal.component";
import {EnvironmentService} from "../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-active-ilt-events-list',
  templateUrl: './active-ilt-events-list.component.html',
  styleUrls: ['./active-ilt-events-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class ActiveIltEventsListComponent implements OnInit {
  @Select(ActiveIltEventsState.loading)
  loading$: Observable<boolean>;

  @Select(ActiveIltEventsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(ActiveIltEventsState.iltEvents)
  iltEvents$: Observable<ILTEventListItem[]>;

  @Select(ActiveIltEventsState.pageSize)
  pageSize$: Observable<number>;

  @Select(ActiveIltEventsState.total)
  total$: Observable<number>;

  @Select(ActiveIltEventsState.pendingActionEventCount)
  pendingActionEventCount$: Observable<number>;

  @Select(ActiveIltEventsState.pageIndex)
  pageIndex$: Observable<number>;

  public filterVenue = [
    { text: 'Virtual Delivery', value: 'virtual' },
    { text: 'Classroom Delivery', value: 'classroom' },
  ];

  public datePickerRangeControl: FormControl = new FormControl('');
  private filterSelectedDates: IFilterSelectedDates[];

  trackByFn: TrackByFunction<ILTEventListItem> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetActiveILTEventsState());
    this.onFilterSelectedDatesChange();
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    if (this.filterSelectedDates) {
      pageable.filterParams = [...pageable.filterParams, ...this.filterSelectedDates];
    }

    this.store.dispatch([new ChangeActiveILTEventsPaginationParams({ pageable }), new GetActiveILTEvents()]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeActiveILTEventsPaginationParams({ pageable: { filter: searchPhrase, page: 1, filterParams: this.filterSelectedDates }}),
      new GetActiveILTEvents(),
    ]);
  }

  cancelEvent(e: MouseEvent, event: ILTEventListItem) {
    e.stopPropagation();
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Cancel Course Event?',
      nzContent: CancelEventConfirmModalComponent,
      nzComponentParams: {
        name: event.name,
        date: moment(event.startDate).format('DD MM yyyy'),
        learnerCount: event.enrolledLearnerCounter,
      },
      nzWidth: 660,
      nzCloseIcon: null,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Cancel Course Event',
          danger: true,
          disabled: (data) => !data.form.valid,
          onClick: async (data) => {
            const reason = data.form.get('reason').value;
            return this.store
              .dispatch(new CancelILTEvent({ eventId: event.id, cancelReason: reason }))
              .toPromise()
              .then((_) => {
                modal.close();
                this.store.dispatch([
                  new ChangeActiveILTEventsPaginationParams({ pageable: { page: 1 } }),
                  new GetActiveILTEvents(),
                ]);
              });
          },
        },
      ],
    });
  }

  private onFilterSelectedDatesChange(): void {
    this.datePickerRangeControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((selectedRanges) => {
      this.filterSelectedDates = createFiltersFromDateRangeSelect(selectedRanges);

      this.store.dispatch([
        new ChangeActiveILTEventsPaginationParams({ pageable: { filterParams: this.filterSelectedDates }}),
        new GetActiveILTEvents(),
      ]);
    });
  }
}
