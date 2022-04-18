import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { patch, removeItem } from "@ngxs/store/operators";

import {
  ChangeDraftSPCoursesPaginationParams,
  DeleteDraftSPCourse,
  GetDraftSelfPacedCourses,
  ResetDraftSPCoursesState
} from "./draft-sp-courses-list.actions";
import {
  SpCoursesService
} from "../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-courses.service";

import { DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  DraftSelfPacedCourse,
  IPageable
} from "../../../../../../../../../../libs/shared/src/lib/models";

export class DraftSpCoursesListStateModel {
  loading: boolean;
  selfPacedCourses: DraftSelfPacedCourse[];
  total: number;
  paginationParams: IPageable;
}

@State<DraftSpCoursesListStateModel>({
  name: 'draftSpCoursesList',
  defaults: {
    loading: false,
    selfPacedCourses: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class DraftSpCoursesListState {

  @Selector([DraftSpCoursesListState])
  static loading(state: DraftSpCoursesListStateModel) {
    return state.loading;
  }

  @Selector([DraftSpCoursesListState])
  static selfPacedCourses(state: DraftSpCoursesListStateModel) {
    return state.selfPacedCourses;
  }

  @Selector([DraftSpCoursesListState])
  static total(state: DraftSpCoursesListStateModel) {
    return state.total;
  }

  @Selector([DraftSpCoursesListState])
  static searchPhrase(state: DraftSpCoursesListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([DraftSpCoursesListState])
  static pageIndex(state: DraftSpCoursesListStateModel) {
    return state.paginationParams.page;
  }

  @Selector([DraftSpCoursesListState])
  static pageSize(state: DraftSpCoursesListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly selfPacedCoursesService: SpCoursesService) {
  }

  @Action(GetDraftSelfPacedCourses)
  getDraftSelfPacedCourses({ patchState, getState }: StateContext<DraftSpCoursesListStateModel>) {
    const { paginationParams } = getState();

    return this.selfPacedCoursesService.getDraftSelfPacedCourses(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: DraftSelfPacedCourse[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ selfPacedCourses: resource.response.data, total: resource.response.flags.size });
        }
      })
    );
  }

  @Action(DeleteDraftSPCourse)
  deleteDraftSPCourse({ getState, patchState, setState }: StateContext<DraftSpCoursesListStateModel>,
                      { payload: { id } }: DeleteDraftSPCourse) {
    return this.selfPacedCoursesService.deleteDraftSelfPacedCourse(id)
      .pipe(
        tap((resource) => {
          patchState({loading: resource.isPending});

          if (resource.isSuccess) {
            setState(patch({
              selfPacedCourses: removeItem<DraftSelfPacedCourse>((course) => course.id === id)
            }));
          }
        })
      );
  }

  @Action(ChangeDraftSPCoursesPaginationParams)
  changeDraftSPCoursesPaginationParams(
    { patchState, getState }: StateContext<DraftSpCoursesListStateModel>,
    { payload }: ChangeDraftSPCoursesPaginationParams
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetDraftSPCoursesState)
  resetDraftSPCoursesState({ patchState }: StateContext<DraftSpCoursesListStateModel>) {
    patchState({
      loading: false,
      selfPacedCourses: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
