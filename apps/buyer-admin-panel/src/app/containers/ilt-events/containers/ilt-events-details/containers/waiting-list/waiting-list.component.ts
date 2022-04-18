import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { iif, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import {
  AddWaitingListLearners,
  ChangeWaitingListPaginationParams,
  DemoteWaitingListLearner,
  GetWaitingList,
  PromoteWaitingListLearner,
  RemoveWaitingListLearners,
  ResetWaitingListState,
} from './state/waiting-list.actions';
import { WaitingListState } from './state/waiting-list.state';
import { WaitingListService } from '../../../../../../../../../../libs/shared/src/lib/services/events/waiting-list.service';
import { EventInfoEditHandlerService } from '../../../../../../../../../../libs/shared/src/lib/services/events/event-info-edit-handler.service';

import {
  EnrollmentPolicyKeys,
  IKeyValuePair,
  ILTEvent,
  ILTEventLearner
} from "../../../../../../../../../../libs/shared/src/lib/models";
import {
  RemoveWaitingListModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/remove-waiting-list-modal/remove-waiting-list-modal.component";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  AssignUsersModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/assign-users-modal/assign-users-modal.component";
import {AdminCoursesService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";

const NO_LEARNERS_TEXT = 'There are no learners enrolled in the waiting list';
const REMAINING_SEATS_EXIST = 'There are available seats for this Course Event.';

@Component({
  selector: 'leap-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class WaitingListComponent implements OnInit {
  noResultsText = NO_LEARNERS_TEXT;
  remainingSeatsExist = REMAINING_SEATS_EXIST;
  enrollmentPolicyKeys = EnrollmentPolicyKeys;
  waitingListTotal: number;

  @Input() iltEvent: ILTEvent;

  get disabled(): boolean {
    return this.iltEvent.waitingQueueStatus?.configKey !== 'enabled';
  }

  @Select(WaitingListState.loading)
  loading$: Observable<boolean>;

  @Select(WaitingListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(WaitingListState.waitingListLearners)
  waitingListLearners$: Observable<ILTEventLearner[]>;

  @Select(WaitingListState.pageSize)
  pageSize$: Observable<number>;

  @Select(WaitingListState.total)
  total$: Observable<number>;

  @Select(WaitingListState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<ILTEventLearner> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly eventInfoEditService: EventInfoEditHandlerService,
    private readonly adminCourseService: AdminCoursesService,
    private readonly waitingListService: WaitingListService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetWaitingListState());

    this.total$.pipe(untilDestroyed(this)).subscribe((total) => (this.waitingListTotal = total));
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeWaitingListPaginationParams({ pageable }),
      new GetWaitingList({ classEventId: this.iltEvent.classEvent.id }),
    ]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeWaitingListPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetWaitingList({ classEventId: this.iltEvent.classEvent.id }),
    ]);
  }

  promoteWaitingListLearner(learner: ILTEventLearner): void {
    this.store.dispatch(new PromoteWaitingListLearner(this.iltEvent.classEvent.id, { username: learner.username }));
  }

  demoteWaitingListLearner(learner: ILTEventLearner): void {
    this.store.dispatch(new DemoteWaitingListLearner(this.iltEvent.classEvent.id, { username: learner.username }));
  }

  toggleWaitingList(): void {
    this.eventInfoEditService.editProperty('waitingList', this.iltEvent);
  }

  showAssignUsersModal(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Assign Users to Waiting List',
      nzContent: AssignUsersModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        data: this.iltEvent,
        waitingList: true,
        waitingListTotal: this.waitingListTotal,
      },
      nzWidth: 690,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => d.validateWaitingList,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const lxpGroupUsersEmails = data.lxpGroupUsers ? data.lxpGroupUsers.map((u) => u.key) : [];
            const learnersList = data.bulkLearners
              ? (data.bulkLearners as ILTEventLearner[]).map((learner) => learner.username)
              : [...(formValue.lxpUsers ?? []), ...lxpGroupUsersEmails];

            return combineLatest([
              this.waitingListService.validateWaitingListLearners(this.iltEvent.id, learnersList),
              iif(
                () => data.data.course.enrollmentPolicy?.configKey === this.enrollmentPolicyKeys.SINGLE,
                this.adminCourseService.validateLearnerSession(data.data.course.parentId, learnersList),
                of([]),
              ),
            ])
              .pipe(
                map((validationResponses: IKeyValuePair[][]) =>
                  validationResponses.map((items: IKeyValuePair[]) =>
                    items.filter((item) => !item.value).map((item) => item.key),
                  ),
                ),
                switchMap(([alreadyEnrolledUsers, invalidUsers]: [string[], string[]]) => {
                  if (invalidUsers?.length === 0 && alreadyEnrolledUsers?.length === 0) {
                    return this.store.dispatch(new AddWaitingListLearners(this.iltEvent.classEvent.id, learnersList));
                  } else {
                    data.setErrorMessage(alreadyEnrolledUsers, invalidUsers);
                    return of(null);
                  }
                }),
              )
              .toPromise()
              .then((_) => {
                if (_) {
                  modal.destroy();
                }
              });
          },
        },
      ],
    });
  }

  removeLearner(learner: ILTEventLearner): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Remove Learner from Waiting List',
      nzContent: RemoveWaitingListModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: { learner },
      nzWidth: 690,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Remove Learner',
          danger: true,
          onClick: async () => {
            return this.store
              .dispatch(new RemoveWaitingListLearners(this.iltEvent.classEvent.id, [learner]))
              .pipe(untilDestroyed(this))
              .toPromise()
              .then(() => modal.destroy());
          },
        },
      ],
    });
  }
}
