import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

import { IltCourseReviewsState } from './state/ilt-course-reviews.state';
import {
  ResetCourseReviewsListState,
  GetCourseReviews,
  ChangeCourseReviewsPaginationParams,
  DeleteCourseReview,
} from './state/ilt-course-reviews.action';

import {EventReview} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  DangerActionModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";

const NO_REVIEWS_TEXT = 'There are no reviews for this course';

@Component({
  selector: 'leap-ilt-course-reviews',
  templateUrl: './ilt-course-reviews.component.html',
  styleUrls: ['./ilt-course-reviews.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseReviewsComponent implements OnInit {
  @Select(IltCourseReviewsState.loading)
  loading$: Observable<boolean>;

  @Select(IltCourseReviewsState.eventReviews)
  courseReviews$: Observable<EventReview[]>;

  @Select(IltCourseReviewsState.pageSize)
  pageSize$: Observable<number>;

  @Select(IltCourseReviewsState.total)
  total$: Observable<number>;

  @Select(IltCourseReviewsState.pageIndex)
  pageIndex$: Observable<number>;

  noResultsText = NO_REVIEWS_TEXT;

  range = [1, 2, 3, 4, 5];
  starColor = 'orange';

  filterRating = [
    { text: '5 stars', value: '5' },
    { text: '4 stars', value: '4' },
    { text: '3 stars', value: '3' },
    { text: '2 stars', value: '2' },
    { text: '1 stars', value: '1' },
  ];

  filterReview = [
    { text: 'Only Reviews & Ratings', value: 'only-reviews-with-ratings' },
    { text: 'Only Rating', value: 'only-ratings' },
  ];

  trackByFn: TrackByFunction<EventReview> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetCourseReviewsListState());
  }

  deleteCourseReview(e: MouseEvent, reviewId: string, courseEventId: string) {
    e.preventDefault();
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Delete Course Review?',
      nzContent: DangerActionModalComponent,
      nzComponentParams: {
        mainExp: 'You are about to delete a Review. This action cannot be undone. How do you wish to proceed?',
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
          label: 'Delete Review',
          danger: true,
          onClick: async (data) => {
            return this.store
              .dispatch(new DeleteCourseReview({ id: reviewId, courseEventId: courseEventId }))
              .toPromise()
              .then((_) => {
                modal.destroy();
                this.store.dispatch([
                  new ChangeCourseReviewsPaginationParams({ pageable: { page: 1 } }),
                  new GetCourseReviews(this.getCurrentCourseId()),
                ]);
              });
          },
        },
      ],
    });
  }

  private getCurrentCourseId(): string {
    return this.route.snapshot.paramMap.get('id');
  }

  public isMarkedOthers = (starsCount: number, index: number) => {
    if (starsCount >= index + 1) {
      return 'fa-star';
    } else if (starsCount > index && starsCount < index + 1) {
      return 'fa-star-half-o';
    } else {
      return 'fa-star-o';
    }
  };

  formatDate(dt: string, type: string) {
    if (dt && type === 'review') {
      return moment(dt).format('HH:mm, D MMM YYYY');
    } else if (dt && type === 'event') {
      return moment(dt).format('D MMM YYYY');
    } else {
      return '-';
    }
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeCourseReviewsPaginationParams({ pageable }),
      new GetCourseReviews(this.getCurrentCourseId()),
    ]);
  }

  onSearch(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeCourseReviewsPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetCourseReviews(this.getCurrentCourseId()),
    ]);
  }
}
