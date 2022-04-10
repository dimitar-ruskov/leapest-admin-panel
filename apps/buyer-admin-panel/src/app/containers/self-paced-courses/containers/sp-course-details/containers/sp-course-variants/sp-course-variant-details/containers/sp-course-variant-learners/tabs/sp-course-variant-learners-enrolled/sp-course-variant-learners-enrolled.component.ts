import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { SPCourseLanguageVariant } from '../../../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table/ng-zorro-antd-table';


import { RemoveSPCourseLanguageVariantLearner } from '../../../../state/sp-course-variant-details.actions';
import { GetSPCourseLanguageVariantExams } from '../../../../state/sp-course-variant-exams/sp-course-variant-exams.actions';
import { SpCourseVariantLearnersEnrolledState } from '../../../../state/sp-course-variant-learners/sp-course-variant-learners-enrolled.state';
import {
  ChangeSPCourseLanguageVariantLearnersEnrolledPage,
  ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams,
  ExportLearnerFromSPCourseLanguageVariantLearnersEnrolled,
  GetSPCourseLanguageVariantLearnersEnrolled,
} from '../../../../state/sp-course-variant-learners/sp-course-variant-learners-enrolled.actions';

import { SPCourseLanguageVariantLearner } from '../../../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course-language-variant-learner.model';
import {ExportLearnersTypes} from "../../../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  PAGINATION_LIMIT_CONFIG
} from "../../../../../../../../../../../../../../../libs/shared/src/lib/models/constants";
import {
  createPageableFromTableQueryParams
} from "../../../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DangerActionModalComponent
} from "../../../../../../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";


const REMOVAL_MODAL_CONTENT = {
  mainExp: "You are about to remove this learner's attendance in this session.",
  subExp:
    'After unassigning, an email will be sent to this learner, notifying them on your action. They will be removed from your course and unable to access any materials previously assigned to them for this course. The course seat will become available again. If you wish to proceed, please provide the information below.',
};

@Component({
  selector: 'leap-sp-course-variant-learners-enrolled',
  templateUrl: './sp-course-variant-learners-enrolled.component.html',
  styleUrls: ['./sp-course-variant-learners-enrolled.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCourseVariantLearnersEnrolledComponent implements OnInit {
  @Select(SpCourseVariantLearnersEnrolledState.loading)
  loading$: Observable<boolean>;

  @Select(SpCourseVariantLearnersEnrolledState.learners)
  learners$: Observable<SPCourseLanguageVariantLearner[]>;

  @Select(SpCourseVariantLearnersEnrolledState.total)
  total$: Observable<number>;

  @Select(SpCourseVariantLearnersEnrolledState.pageIndex)
  pageIndex$: Observable<number>;

  @Select(SpCourseVariantLearnersEnrolledState.pageSize)
  pageSize$: Observable<number>;

  @Input() spCourseLanguageVariant: SPCourseLanguageVariant;

  get classEventId(): string {
    return this.spCourseLanguageVariant.classEvent.id;
  }

  public paginationLimit = PAGINATION_LIMIT_CONFIG;
  public searchPlaceholder = 'Find Learners (by name or email)';

  tableRowTrackByFn: TrackByFunction<SPCourseLanguageVariantLearner> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  public ngOnInit(): void {
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantLearnersEnrolledPage({ page: 1 }),
      new GetSPCourseLanguageVariantLearnersEnrolled({ id: this.classEventId }),
    ]);
  }

  public onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams({
        pageable: {
          filter: searchPhrase,
          page: 1,
        },
      }),
      new GetSPCourseLanguageVariantLearnersEnrolled({ id: this.classEventId }),
    ]);
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeSPCourseLanguageVariantLearnersEnrolledPaginationParams({ pageable }),
      new GetSPCourseLanguageVariantLearnersEnrolled({ id: this.classEventId }),
    ]);
  }

  getModalUserDataBoxLines(learner: SPCourseLanguageVariantLearner): string[] {
    return [
      learner.firstName || learner.lastName ? learner.firstName + ' ' + learner.lastName : 'N/A',
      learner.username
    ];
  }

  removeLearner(learner: SPCourseLanguageVariantLearner): void {
    const modal = this.modalService.create({
      nzTitle: 'Remove Learner?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        ...REMOVAL_MODAL_CONTENT,
        boxLines: this.getModalUserDataBoxLines(learner),
      },
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Remove Learner',
          type: 'primary',
          danger: true,
          onClick: async () => {
            return this.store
              .dispatch(
                new RemoveSPCourseLanguageVariantLearner({
                  id: this.spCourseLanguageVariant.id,
                  learners: [learner.username],
                }),
              )
              .pipe(
                tap(() => {
                  this.store.dispatch([new GetSPCourseLanguageVariantExams({ id: this.spCourseLanguageVariant.id })]);
                }),
              )
              .toPromise()
              .then(() => modal.destroy());
          },
        },
      ],
    });
  }

  public exportLearners(): void {
    this.store.dispatch(
      new ExportLearnerFromSPCourseLanguageVariantLearnersEnrolled({
        id: this.classEventId,
        csvType: ExportLearnersTypes.ACTIVE,
        statuses: [ExportLearnersTypes.ACTIVE, ExportLearnersTypes.PENDING],
      }),
    );
  }
}
