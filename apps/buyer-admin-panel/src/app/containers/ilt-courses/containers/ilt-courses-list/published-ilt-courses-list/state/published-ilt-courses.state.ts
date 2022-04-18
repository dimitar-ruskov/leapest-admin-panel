import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  ChangePublishedILTCoursesPaginationParams,
  GetPublishedILTCourses,
  ResetPublishedILTCoursesState
} from "./published-ilt-courses.actions";
import {
  IltCoursesService
} from "../../../../../../../../../../libs/shared/src/lib/services/courses/ilt-courses/ilt-courses.service";

import { DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  IPageable,
  PublishedILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models";


export class PublishedILTCoursesStateModel {
  loading: boolean;
  iltCourses: PublishedILTCourse[];
  total: number;
  paginationParams: IPageable;
}

@State<PublishedILTCoursesStateModel>({
  name: 'publishedIltCourses',
  defaults: {
    loading: false,
    iltCourses: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class PublishedILTCoursesState {
  @Selector([PublishedILTCoursesState])
  static loading(state: PublishedILTCoursesStateModel) {
    return state.loading;
  }

  @Selector([PublishedILTCoursesState])
  static iltCourses(state: PublishedILTCoursesStateModel) {
    return state.iltCourses;
  }

  @Selector([PublishedILTCoursesState])
  static total(state: PublishedILTCoursesStateModel) {
    return state.total;
  }

  @Selector([PublishedILTCoursesState])
  static searchPhrase(state: PublishedILTCoursesStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([PublishedILTCoursesState])
  static pageIndex(state: PublishedILTCoursesStateModel) {
    return state.paginationParams.page;
  }

  @Selector([PublishedILTCoursesState])
  static pageSize(state: PublishedILTCoursesStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly iltCoursesService: IltCoursesService) {
  }

  @Action(GetPublishedILTCourses)
  getPublishedILTCourses({ patchState, getState }: StateContext<PublishedILTCoursesStateModel>) {
    const { paginationParams } = getState();

    return this.iltCoursesService.getPublishedILTCourses(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: PublishedILTCourse[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltCourses: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(ChangePublishedILTCoursesPaginationParams)
  changePublishedILTCoursesPaginationParams({ patchState, getState }: StateContext<PublishedILTCoursesStateModel>,
                                            { payload }: ChangePublishedILTCoursesPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetPublishedILTCoursesState)
  resetPublishedILTCoursesState({ patchState }: StateContext<PublishedILTCoursesStateModel>) {
    patchState({
      loading: false,
      iltCourses: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
