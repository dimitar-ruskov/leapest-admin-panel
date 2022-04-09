import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

import { IltCourseEventsCommonState } from '../state/ilt-course-events-common.state';
import {
  CancelCourseEvent,
  ChangeEventsPaginationParams,
  GetAllEventsByType,
  ResetCourseEventsState,
} from '../state/ilt-course-events-common.actions';

import {ILTEventListItem} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  CancelEventConfirmModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/cancel-event-confirm-modal/cancel-event-confirm-modal.component";
import {EnvironmentService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-ilt-course-events-active',
  templateUrl: './ilt-course-events-active.component.html',
  styleUrls: ['./ilt-course-events-active.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseEventsActiveComponent implements OnInit {
  @Input() parentId: string;
  private readonly status = 'released';

  @Select(IltCourseEventsCommonState.loading)
  loading$: Observable<boolean>;

  @Select(IltCourseEventsCommonState.courseEvents)
  courseEvents$: Observable<ILTEventListItem[]>;

  @Select(IltCourseEventsCommonState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltCourseEventsCommonState.total)
  total$: Observable<number>;

  @Select(IltCourseEventsCommonState.pageIndex)
  pageIndex$: Observable<number>;

  public filterVenue = [
    { text: 'Virtual Delivery', value: 'virtual' },
    { text: 'Classroom Delivery', value: 'classroom' },
  ];

  trackByFn: TrackByFunction<ILTEventListItem> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetCourseEventsState());
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeEventsPaginationParams({ pageable }),
      new GetAllEventsByType({ status: this.status, parentId: this.parentId }),
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
              .dispatch(new CancelCourseEvent({ eventId: event.id, cancelReason: reason }))
              .toPromise()
              .then((_) => {
                modal.close();
                this.store.dispatch([
                  new ChangeEventsPaginationParams({ pageable: { page: 1 } }),
                  new GetAllEventsByType({ status: this.status, parentId: this.parentId }),
                ]);
              });
          },
        },
      ],
    });
  }
}
