import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { InstructorDetailsState } from './state/instructor-details.state';
import {
  ChangeInstructorDetailsPaginationParams,
  GetEvents,
  GetInstructor,
  ResetInstructorDetailsState,
  UpdateInstructor,
} from './state/instructor-details.actions';
import { InstructorCreateModalComponent } from '../../components/instructor-create-modal/instructor-create-modal.component';

import { InstructorLite } from '../../../../../../../../libs/shared/src/lib/models/interfaces/instructors/instructor.model';
import {IFilterSelectedDates, ILTEventListItem} from "../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  createFiltersFromDateRangeSelect, createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {NotificationService} from "../../../../../../../../libs/shared/src/lib/utils/services/common";

const NO_EVENTS_TEXT = 'No events issued';

@Component({
  selector: 'leap-instructor-details',
  templateUrl: './instructor-details.component.html',
  styleUrls: ['./instructor-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class InstructorDetailsComponent implements OnInit {
  id: string;
  noResultsText = NO_EVENTS_TEXT;

  @Select(InstructorDetailsState.loading)
  loading$: Observable<boolean>;

  @Select(InstructorDetailsState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(InstructorDetailsState.instructor)
  instructor$: Observable<InstructorLite>;

  @Select(InstructorDetailsState.instructorEvents)
  events$: Observable<DeferredResource<ILTEventListItem[]>>;

  @Select(InstructorDetailsState.pageSize)
  pageSize$: Observable<number>;

  @Select(InstructorDetailsState.total)
  total$: Observable<number>;

  @Select(InstructorDetailsState.pageIndex)
  pageIndex$: Observable<number>;

  public showFinishedEvents = false;
  public datePickerModel: Date[];
  public filterSelectedDates: IFilterSelectedDates[];
  public filterVenue = [
    { text: 'Virtual Delivery', value: 'virtual' },
    { text: 'Classroom Delivery', value: 'classroom' },
  ];

  trackByFn: TrackByFunction<ILTEventListItem> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly modalService: NzModalService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');
      this.store.dispatch([new ResetInstructorDetailsState(), new GetInstructor({ id: this.id })]);
    });
  }

  public get getState() {
    return this.showFinishedEvents ? 'finished' : 'released';
  }

  public filterEvents() {
    const state = this.getState;

    this.store.dispatch([new GetEvents({ id: this.id, state })]);
  }

  public onSearchChange(searchPhrase: string): void {
    const state = this.getState;
    this.store.dispatch([
      new ChangeInstructorDetailsPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetEvents({ id: this.id, state }),
    ]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    const state = this.getState;

    if (this.filterSelectedDates) {
      pageable.filterParams = [...pageable.filterParams, ...this.filterSelectedDates];
    }

    this.store.dispatch([
      new ChangeInstructorDetailsPaginationParams({ pageable }),
      new GetEvents({ id: this.id, state }),
    ]);
  }

  public onFilterSelectedDatesChange(): void {
    const state = this.getState;
    this.filterSelectedDates = createFiltersFromDateRangeSelect(this.datePickerModel);

    this.store.dispatch([
      new ChangeInstructorDetailsPaginationParams({ pageable: { filterParams: this.filterSelectedDates } }),
      new GetEvents({ id: this.id, state }),
    ]);
  }

  public onEditInstructor(instructor: InstructorLite) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Instructor',
      nzContent: InstructorCreateModalComponent,
      nzComponentParams: {
        instructor: instructor,
      },
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => !d?.form?.valid || !d?.form?.dirty,
          onClick: async (instance: InstructorCreateModalComponent) => {
            const { username, firstName, lastName } = instance.form.getRawValue();
            const body = {
              username,
              firstName,
              lastName,
            };
            return this.store
              .dispatch(new UpdateInstructor({ instructor: body }))
              .pipe(
                catchError(() => {
                  this.notification.error('This instructor can not be edited.');
                  return of(null);
                }),
                filter((res) => !!res),
                untilDestroyed(this),
              )
              .subscribe(() => modal.destroy());
          },
        },
      ],
    });
  }

  goToEvent(id: string) {
    this.router.navigate(['admin', 'ilt-events', 'details', id]);
  }
}
