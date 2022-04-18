import { Component, ChangeDetectionStrategy, TrackByFunction, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NzTableFilterList, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';

import {
  ChangeUnenrolledILTEventLearnersPaginationParams,
  GetUnenrolledILTEventLearners,
} from './state/ilt-event-learners-unenrolled.actions';
import { IltEventLearnersUnenrolledState } from './state/ilt-event-learners-unenrolled.state';
import { ExportLearnerFromILTEvent } from '../../../state/ilt-event-details.actions';
import {IGlobalStateModel} from "../../../../../../../state/state.model";

import { ExportLearnersTypes } from '../../../../../../../../../../../libs/shared/src/lib/models/events/ilt-event-learners.model';
import {PAGINATION_LIMIT_CONFIG} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {ILTEventUnenrolledLearner} from "../../../../../../../../../../../libs/shared/src/lib/models";

@Component({
  selector: 'leap-ilt-event-learners-unenrolled',
  templateUrl: './ilt-event-learners-unenrolled.component.html',
  styleUrls: ['./ilt-event-learners-unenrolled.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltEventLearnersUnenrolledComponent {
  @Input() classEventId: string;
  @Input() eventId: string;
  @Select(IltEventLearnersUnenrolledState.loading)
  loading$: Observable<boolean>;

  @Select(IltEventLearnersUnenrolledState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(IltEventLearnersUnenrolledState.iltEventLearners)
  iltEventLearners$: Observable<ILTEventUnenrolledLearner[]>;

  @Select(IltEventLearnersUnenrolledState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltEventLearnersUnenrolledState.total)
  total$: Observable<number>;

  @Select(IltEventLearnersUnenrolledState.pageIndex)
  pageIndex$: Observable<number>;

  @Select((state: IGlobalStateModel) => state.core.enrollmentCauseTypes)
  enrollmentCauseTypes$: Observable<NzTableFilterList[]>;

  @Select((state: IGlobalStateModel) => state.core.unenrollmentCauseTypes)
  unenrollmentCauseTypes$: Observable<NzTableFilterList[]>;

  public paginationLimit = PAGINATION_LIMIT_CONFIG;
  public searchPlaceholder = 'Find Learners (by name or email)';

  trackByFn: TrackByFunction<ILTEventUnenrolledLearner> = (index, item) => item.id;

  constructor(private readonly store: Store) {}

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeUnenrolledILTEventLearnersPaginationParams({ pageable }),
      new GetUnenrolledILTEventLearners({ classEventId: this.classEventId }),
    ]);
  }

  public onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeUnenrolledILTEventLearnersPaginationParams({
        pageable: {
          filter: searchPhrase,
          page: 1,
        },
      }),
      new GetUnenrolledILTEventLearners({ classEventId: this.classEventId }),
    ]);
  }

  exportLearners(): void {
    this.store.dispatch(
      new ExportLearnerFromILTEvent({
        classEventId: this.classEventId,
        csvType: ExportLearnersTypes.UNENROLLED,
        statuses: [ExportLearnersTypes.UNENROLLED],
      }),
    );
  }
}
