import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';

import {
  ApproveLearnerRegistrationRequest,
  ExportLearnerFromILTEvent,
  RejectLearnerRegistrationRequest,
} from '../../../state/ilt-event-details.actions';
import {
  ChangePendingILTEventLearnersPaginationParams,
  GetPendingILTEventLearners,
  ResetPendingILTEventLearnersState,
} from './state/ilt-event-learners-pending.actions';
import { IltEventLearnersPendingState } from './state/ilt-event-learners-pending.state';

import { ExportLearnersTypes } from '../../../../../../../../../../../libs/shared/src/lib/models/constants/ilt-event-learners.model';
import {ILTEventLearner} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {PAGINATION_LIMIT_CONFIG} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DangerActionModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";

const APPROVAL_MODAL_CONTENT = {
  mainExp: "You are about to approve this learner's attendance in this session.",
  subExp:
    'After approval, this learner will be moved to the enrolled list and an email will be sent, informing them of your decision. Course materials will become available after the event activation date.\nHow do you wish to proceed?',
};
function getModalUserDataBoxLines(learner: ILTEventLearner): string[] {
  return [learner.firstName || learner.lastName ? learner.firstName + ' ' + learner.lastName : 'N/A', learner.username];
}

@Component({
  selector: 'leap-ilt-event-learners-pending',
  templateUrl: './ilt-event-learners-pending.component.html',
  styleUrls: ['./ilt-event-learners-pending.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltEventLearnersPendingComponent implements OnInit {
  @Input() classEventId: string;
  @Input() eventId: string;
  @Select(IltEventLearnersPendingState.loading)
  loading$: Observable<boolean>;

  @Select(IltEventLearnersPendingState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(IltEventLearnersPendingState.iltEventLearners)
  iltEventLearners$: Observable<ILTEventLearner[]>;

  @Select(IltEventLearnersPendingState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltEventLearnersPendingState.total)
  total$: Observable<number>;

  @Select(IltEventLearnersPendingState.pageIndex)
  pageIndex$: Observable<number>;

  public paginationLimit = PAGINATION_LIMIT_CONFIG;
  public searchPlaceholder = 'Find Learners (by name or email)';
  trackByFn: TrackByFunction<ILTEventLearner> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetPendingILTEventLearnersState());
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangePendingILTEventLearnersPaginationParams({ pageable }),
      new GetPendingILTEventLearners({ classEventId: this.classEventId }),
    ]);
  }

  public onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangePendingILTEventLearnersPaginationParams({
        pageable: {
          filter: searchPhrase,
          page: 1,
        },
      }),
      new GetPendingILTEventLearners({ classEventId: this.classEventId }),
    ]);
  }

  public approveLearner(learner: ILTEventLearner): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Approve Registration?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        ...APPROVAL_MODAL_CONTENT,
        boxLines: getModalUserDataBoxLines(learner),
        reasonRequired: false,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Approve Registration',
          type: 'primary',
          disabled: (data) => !data.form.valid,
          onClick: async (data) => {
            return this.store
              .dispatch(
                new ApproveLearnerRegistrationRequest({
                  username: learner.username,
                  courseEventId: this.eventId,
                }),
              )
              .toPromise()
              .then((_) => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  public rejectLearner(learner: ILTEventLearner): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Reject Registration?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        mainExp: "You are about to reject this learner's attendance in this session.",
        boxLines: [learner.firstName + ' ' + learner.lastName, learner.username],
        reasonRequired: true,
        subExp:
          'After rejection, an email will be sent to this learner, notifying them on your decision. and they will be removed from your course. If you wish to proceed, please provide a reason.',
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Reject Registration',
          danger: true,
          disabled: (data) => !data.form.valid,
          onClick: async (data) => {
            const reason = data.form.get('reason').value;
            return this.store
              .dispatch(
                new RejectLearnerRegistrationRequest({
                  username: learner.username,
                  courseEventId: this.eventId,
                  message: reason,
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  public exportLearners(): void {
    this.store.dispatch(
      new ExportLearnerFromILTEvent({
        classEventId: this.classEventId,
        csvType: ExportLearnersTypes.PENDING,
        statuses: [ExportLearnersTypes.PENDING],
      }),
    );
  }
}
