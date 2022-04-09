import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';

import { IltCoursesService } from '../../../services/ilt-courses.service';
import {
  ChangeDraftILTCoursesPaginationParams,
  DeleteDraftILTCourse,
  GetDraftILTCourses, ResetDraftILTCoursesState
} from './draft-ilt-courses.actions';

import {DraftILTCourse, IPageable} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../../libs/shared/src/lib/models/constants";


export class DraftILTCoursesStateModel {
  loading: boolean;
  iltCourses: DraftILTCourse[];
  total: number;
  paginationParams: IPageable;
}

@State<DraftILTCoursesStateModel>({
  name: 'draftIltCourses',
  defaults: {
    loading: false,
    iltCourses: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class DraftILTCoursesState {
  @Selector([DraftILTCoursesState])
  static loading(state: DraftILTCoursesStateModel) {
    return state.loading;
  }

  @Selector([DraftILTCoursesState])
  static iltCourses(state: DraftILTCoursesStateModel) {
    return state.iltCourses;
  }

  @Selector([DraftILTCoursesState])
  static total(state: DraftILTCoursesStateModel) {
    return state.total;
  }

  @Selector([DraftILTCoursesState])
  static searchPhrase(state: DraftILTCoursesStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([DraftILTCoursesState])
  static pageIndex(state: DraftILTCoursesStateModel) {
    return state.paginationParams.page;
  }

  @Selector([DraftILTCoursesState])
  static pageSize(state: DraftILTCoursesStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly iltCoursesService: IltCoursesService) {
  }

  @Action(GetDraftILTCourses)
  getDraftILTCourses({ patchState, getState }: StateContext<DraftILTCoursesStateModel>) {
    const { paginationParams } = getState();

    return this.iltCoursesService.getDraftILTCourses(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: DraftILTCourse[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ iltCourses: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(DeleteDraftILTCourse)
  deleteDraftILTCourse({ getState, patchState, setState }: StateContext<DraftILTCoursesStateModel>,
                       { payload: { id } }: DeleteDraftILTCourse) {
    return this.iltCoursesService.deleteDraftILTCourse(id)
      .pipe(
        tap((resource) => {
          patchState({ loading: resource.isPending });

          if (resource.isSuccess) {
            setState(patch({
              iltCourses: removeItem<DraftILTCourse>((course) => course.id === id)
            }));
          }
        })
      );
  }

  @Action(ChangeDraftILTCoursesPaginationParams)
  changeDraftILTCoursesPaginationParams(
    { patchState, getState }: StateContext<DraftILTCoursesStateModel>,
    { payload }: ChangeDraftILTCoursesPaginationParams
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetDraftILTCoursesState)
  resetDraftSPCoursesState({ patchState }: StateContext<DraftILTCoursesStateModel>) {
    patchState({
      loading: false,
      iltCourses: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
