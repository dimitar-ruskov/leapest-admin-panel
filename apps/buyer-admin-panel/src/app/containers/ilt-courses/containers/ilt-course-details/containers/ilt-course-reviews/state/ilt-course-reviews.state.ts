import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { IltCoursesService } from '../../../../../services/ilt-courses.service';
import { GetCourseReviews, ResetCourseReviewsListState, ChangeCourseReviewsPaginationParams, DeleteCourseReview } from './ilt-course-reviews.action';

import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {EventReview, IPageable} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../../../libs/shared/src/lib/models/constants";

export class IltCourseReviewsStateModel {
  loading: boolean;
  courseReviews: EventReview[];
  total: number;
  paginationParams: IPageable;
}

@State<IltCourseReviewsStateModel>({
  name: 'courseReviews',
  defaults: {
    loading: false,
    courseReviews: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class IltCourseReviewsState {

  @Selector([IltCourseReviewsState])
  static loading(state: IltCourseReviewsStateModel) {
    return state.loading;
  }

  @Selector([IltCourseReviewsState])
  static eventReviews(state: IltCourseReviewsStateModel) {
    return state.courseReviews;
  }

  @Selector([IltCourseReviewsState])
  static total(state: IltCourseReviewsStateModel) {
    return state.total;
  }

  @Selector([IltCourseReviewsState])
  static searchPhrase(state: IltCourseReviewsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([IltCourseReviewsState])
  static pageIndex(state: IltCourseReviewsStateModel) {
    return state.paginationParams.page;
  }

  @Selector([IltCourseReviewsState])
  static pageSize(state: IltCourseReviewsStateModel) {
    return state.paginationParams.limit;
  }


  constructor(private readonly iltCourseService: IltCoursesService) { }

  @Action(GetCourseReviews)
  getCourseReviews(
    { patchState, getState }: StateContext<IltCourseReviewsStateModel>,
    { courseId }: GetCourseReviews
  )
  { const { paginationParams } = getState();
    return this.iltCourseService.getCourseReviews(courseId, paginationParams).pipe(
        tap((resource: DeferredResource<{ data: any , count: number}>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          const responseSize = resource.response.data.count;
          patchState({ courseReviews: resource.response.data.data , total: responseSize ? responseSize : 0 });
        }
       })
    );
  }

  @Action(DeleteCourseReview)
  deleteCourseReview({ getState, patchState, setState }: StateContext<IltCourseReviewsStateModel>,
                       { payload: { id, courseEventId } }: DeleteCourseReview) {
    return this.iltCourseService.deleteCourseReviews(id, courseEventId)
  }

  @Action(ChangeCourseReviewsPaginationParams)
  changeCourseReviewsPaginationParams
    ({ patchState, getState }: StateContext<IltCourseReviewsStateModel>,
      { payload }: ChangeCourseReviewsPaginationParams) {
    const { paginationParams } = getState();
    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }


  @Action(ResetCourseReviewsListState)
  resetEventReviewListState({ patchState }: StateContext<IltCourseReviewsStateModel>) {
    patchState({
      loading: false,
      courseReviews: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }

}
