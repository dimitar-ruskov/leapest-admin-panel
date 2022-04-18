import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { NzTableQueryParams } from "ng-zorro-antd/table";

import { IltCourseEventsCommonState } from "../state/ilt-course-events-common.state";
import {
  ChangeEventsPaginationParams,
  GetAllEventsByType,
  ResetCourseEventsState
} from "../state/ilt-course-events-common.actions";

import { ILTEventListItem } from "../../../../../../../../../../../libs/shared/src/lib/models";
import { createPageableFromTableQueryParams } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  EnvironmentService
} from "../../../../../../../../../../../libs/shared/src/lib/services/common/environment.service";

@Component({
  selector: 'leap-ilt-course-events-draft',
  templateUrl: './ilt-course-events-draft.component.html',
  styleUrls: ['./ilt-course-events-draft.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseEventsDraftComponent implements OnInit {
  @Input() parentId: string;
  private readonly status = 'draft';

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
