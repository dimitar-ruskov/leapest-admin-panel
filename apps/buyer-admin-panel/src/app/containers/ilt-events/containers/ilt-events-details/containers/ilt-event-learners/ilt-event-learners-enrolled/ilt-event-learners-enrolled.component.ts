import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTableFilterList, NzTableQueryParams } from "ng-zorro-antd/table";
import { Observable } from "rxjs";

import { ExportLearnerFromILTEvent, RemoveLearnerFromILTEvent } from "../../../state/ilt-event-details.actions";
import {
  ChangeEnrolledILTEventLearnersPaginationParams,
  GetEnrolledILTEventLearners,
  ResetEnrolledILTEventLearnersState
} from "./state/ilt-event-learners-enrolled.actions";
import { IltEventLearnersEnrolledState } from "./state/ilt-event-learners-enrolled.state";
import { IGlobalStateModel } from "../../../../../../../state/state.model";

import {
  ExportLearnersTypes,
  ILTEventLearner,
  PAGINATION_LIMIT_CONFIG
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import { createPageableFromTableQueryParams } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DangerActionModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";

@Component({
  selector: 'leap-ilt-event-learners-enrolled',
  templateUrl: './ilt-event-learners-enrolled.component.html',
  styleUrls: ['./ilt-event-learners-enrolled.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltEventLearnersEnrolledComponent implements OnInit {
  @Input() classEventId: string;
  @Input() eventId: string;
  @Select(IltEventLearnersEnrolledState.loading)
  loading$: Observable<boolean>;

  @Select(IltEventLearnersEnrolledState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(IltEventLearnersEnrolledState.iltEventLearners)
  iltEventLearners$: Observable<ILTEventLearner[]>;

  @Select(IltEventLearnersEnrolledState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltEventLearnersEnrolledState.total)
  total$: Observable<number>;

  @Select(IltEventLearnersEnrolledState.pageIndex)
  pageIndex$: Observable<number>;

  @Select((state: IGlobalStateModel) => state.core.enrollmentCauseTypes)
  enrollmentCauseTypes$: Observable<NzTableFilterList[]>;

  public paginationLimit = PAGINATION_LIMIT_CONFIG;
  public searchPlaceholder = 'Find Learners (by name or email)';

  trackByFn: TrackByFunction<ILTEventLearner> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetEnrolledILTEventLearnersState());
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeEnrolledILTEventLearnersPaginationParams({ pageable }),
      new GetEnrolledILTEventLearners({ classEventId: this.classEventId }),
    ]);
  }

  public onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeEnrolledILTEventLearnersPaginationParams({
        pageable: {
          filter: searchPhrase,
          page: 1,
        },
      }),
      new GetEnrolledILTEventLearners({ classEventId: this.classEventId }),
    ]);
  }

  public removeLearner(learner: ILTEventLearner): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Remove learner?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        mainExp: "You are about to remove this learner's attendance in this session.",
        boxLines: [learner.firstName + ' ' + learner.lastName, learner.username],
        subExp:
          'After unassigning, an email will be sent to this learner, notifying them on your action. . They will be removed from your course and unable to access any materials previously assigned to them for this course. The course seat will become available again. If you wish to proceed, please provide the information below.',
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
          label: 'Remove Learner',
          danger: true,
          onClick: async (data) => {
            return this.store
              .dispatch(new RemoveLearnerFromILTEvent(this.eventId, [learner.username]))
              .toPromise()
              .then((_) => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  public exportLearners(): void {
    this.store.dispatch(
      new ExportLearnerFromILTEvent({
        classEventId: this.classEventId,
        csvType: ExportLearnersTypes.ACTIVE,
        statuses: [ExportLearnersTypes.ACTIVE, ExportLearnersTypes.COMPLETED],
      }),
    );
  }
}
