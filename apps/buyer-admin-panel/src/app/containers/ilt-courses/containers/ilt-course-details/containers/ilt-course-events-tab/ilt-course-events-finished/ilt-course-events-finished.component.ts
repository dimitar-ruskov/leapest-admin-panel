import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { IltCourseEventsCommonState } from '../state/ilt-course-events-common.state';
import {
  ChangeEventsPaginationParams,
  GetAllEventsByType,
  ResetCourseEventsState,
} from '../state/ilt-course-events-common.actions';

import {ILTEventListItem} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {EnvironmentService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-ilt-course-events-finished',
  templateUrl: './ilt-course-events-finished.component.html',
  styleUrls: ['./ilt-course-events-finished.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseEventsFinishedComponent implements OnInit {
  @Input() parentId: string;
  private readonly status = 'finished';

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

  trackByFn: TrackByFunction<ILTEventListItem> = (index, item) => item.id;

  constructor(private readonly store: Store, public readonly environmentService: EnvironmentService) {}

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
}
