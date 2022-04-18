import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import {
  GetCourseEventReviews,
  DeleteCourseEventReview,
  ChangeEventReviewsPaginationParams,
  ResetEventReviewsListState,
} from './state/ilt-event-reviews.actions';
import { EventReviewsState } from './state/ilt-event-reviews.state';

import {EventReview} from "../../../../../../../../../../libs/shared/src/lib/models";
import {createPageableFromTableQueryParams} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DangerActionModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/danger-action-modal/danger-action-modal.component";

const NO_EVENT_REVIEWS_TEXT = 'There are no event reviews for this event.';

@Component({
  selector: 'leap-ilt-event-reviews',
  templateUrl: './ilt-event-reviews.component.html',
  styleUrls: ['./ilt-event-reviews.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventReviewsComponent implements OnInit {
  noResultsText = NO_EVENT_REVIEWS_TEXT;

  @Input() eventId: string;
  range = [1, 2, 3, 4, 5];
  starColor = 'orange';

  @Select(EventReviewsState.loading)
  loading$: Observable<boolean>;

  @Select(EventReviewsState.eventReviews)
  eventReviews$: Observable<EventReview[]>;

  @Select(EventReviewsState.pageSize)
  pageSize$: Observable<number>;

  @Select(EventReviewsState.total)
  total$: Observable<number>;

  @Select(EventReviewsState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<EventReview> = (index, item) => item.id;

  constructor(private readonly store: Store, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.store.dispatch([new ResetEventReviewsListState()]);
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeEventReviewsPaginationParams({ pageable }),
      new GetCourseEventReviews(this.eventId),
    ]);
  }

  deleteEventReview(e: MouseEvent, reviewId: string): void {
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
              .dispatch(new DeleteCourseEventReview({ id: reviewId, eventId: this.eventId }))
              .toPromise()
              .then((_) => {
                modal.destroy();
                this.store.dispatch([
                  new ChangeEventReviewsPaginationParams({ pageable: { page: 1 } }),
                  new GetCourseEventReviews(this.eventId),
                ]);
              });
          },
        },
      ],
    });
  }

  public isMarkedOthers = (starsCount: number, index: number): string => {
    if (starsCount >= index + 1) {
      return 'fa-star';
    } else if (starsCount > index && starsCount < index + 1) {
      return 'fa-star-half-o';
    } else {
      return 'fa-star-o';
    }
  };

  formatDate(dt: string): string {
    if (dt) {
      return moment(dt).format('HH:mm, D MMM YYYY');
    } else {
      return '-';
    }
  }
}
