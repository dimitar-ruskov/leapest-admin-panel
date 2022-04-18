import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table";


import {
  ApproveSPCourseLanguageVariantLearnerRegistrationRequest,
  RejectSPCourseLanguageVariantLearnerRegistrationRequest
} from "../../../../state/sp-course-variant-details.actions";

import {
  ExportLearnersTypes,
  PAGINATION_LIMIT_CONFIG,
  SPCourseLanguageVariant,
  SPCourseLanguageVariantLearner
} from "../../../../../../../../../../../../../../../libs/shared/src/lib/models";

import {
  createPageableFromTableQueryParams
} from "../../../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DangerActionModalComponent
} from "../../../../../../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";
import {
  ChangeSPCourseLanguageVariantLearnersPendingPage,
  ChangeSPCourseLanguageVariantLearnersPendingPaginationParams,
  ExportLearnerFromEvent,
  GetSPCourseLanguageVariantLearnersPending
} from "../../state/sp-course-variant-learners-pending.actions";
import { SpCourseVariantLearnersPendingState } from "../../state/sp-course-variant-learners-pending.state";


const REJECTION_MODAL_CONTENT = {
  mainExp: "You are about to reject this learner's attendance in this session.",
  subExp:
    'After rejection, an email will be sent to this learner, notifying them on your decision. and they will be removed from your course. If you wish to proceed, please provide a reason.',
};

const APPROVAL_MODAL_CONTENT = {
  mainExp: "You are about to approve this learner's attendance in this session.",
  subExp:
    'After approval, this learner will be moved to the enrolled list and an email will be sent, informing them of your decision. Course materials will become available after the event activation date.\nHow do you wish to proceed?',
};

@Component({
  selector: 'leap-sp-course-variant-learners-pending',
  templateUrl: './sp-course-variant-learners-pending.component.html',
  styleUrls: ['./sp-course-variant-learners-pending.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCourseVariantLearnersPendingComponent implements OnInit {
  @Select(SpCourseVariantLearnersPendingState.loading)
  loading$: Observable<boolean>;

  @Select(SpCourseVariantLearnersPendingState.learners)
  learners$: Observable<SPCourseLanguageVariantLearner[] | null>;

  @Select(SpCourseVariantLearnersPendingState.total)
  total$: Observable<number>;

  @Select(SpCourseVariantLearnersPendingState.pageIndex)
  pageIndex$: Observable<number>;

  @Select(SpCourseVariantLearnersPendingState.pageSize)
  pageSize$: Observable<number>;

  @Input() spCourseLanguageVariant: SPCourseLanguageVariant;

  get classEventId(): string {
    return this.spCourseLanguageVariant.classEvent.id;
  }

  public paginationLimit = PAGINATION_LIMIT_CONFIG;
  public searchPlaceholder = 'Find Learners (by name or email)';

  tableRowTrackByFn: TrackByFunction<SPCourseLanguageVariantLearner> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantLearnersPendingPage({ page: 1 }),
      new GetSPCourseLanguageVariantLearnersPending({ id: this.classEventId }),
    ]);
  }

  public exportLearners(): void {
    this.store.dispatch(
      new ExportLearnerFromEvent({
        id: this.classEventId,
        csvType: ExportLearnersTypes.PENDING,
        statuses: [ExportLearnersTypes.PENDING],
      }),
    );
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeSPCourseLanguageVariantLearnersPendingPaginationParams({ pageable }),
      new GetSPCourseLanguageVariantLearnersPending({ id: this.classEventId }),
    ]);
  }

  getModalUserDataBoxLines(learner: SPCourseLanguageVariantLearner): string[] {
    return [
      learner.firstName || learner.lastName ? learner.firstName + ' ' + learner.lastName : 'N/A',
      learner.username
    ];
  }

  public onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantLearnersPendingPaginationParams({
        pageable: {
          filter: searchPhrase,
          page: 1,
        },
      }),
      new GetSPCourseLanguageVariantLearnersPending({ id: this.classEventId }),
    ]);
  }

  rejectLearner(learner: SPCourseLanguageVariantLearner): void {
    const variantId = this.spCourseLanguageVariant.id;

    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Reject Registration?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        ...REJECTION_MODAL_CONTENT,
        boxLines: this.getModalUserDataBoxLines(learner),
        reasonRequired: true,
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
          label: 'Reject Registration',
          type: 'primary',
          danger: true,
          disabled: (data) => !data.form.valid,
          onClick: async (data) => {
            const reason = data.form.get('reason').value;

            return this.store
              .dispatch(
                new RejectSPCourseLanguageVariantLearnerRegistrationRequest({
                  username: learner.username,
                  courseEventId: variantId,
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

  approveLearner(learner: SPCourseLanguageVariantLearner): void {
    const variantId = this.spCourseLanguageVariant.id;

    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Approve Registration?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        ...APPROVAL_MODAL_CONTENT,
        boxLines: this.getModalUserDataBoxLines(learner),
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
                new ApproveSPCourseLanguageVariantLearnerRegistrationRequest({
                  username: learner.username,
                  courseEventId: variantId,
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }
}
