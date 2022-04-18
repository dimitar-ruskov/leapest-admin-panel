import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Action, Selector, State, StateContext } from "@ngxs/store";

import {
  SpCoursesService
} from "../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-courses.service";
import {
  ChangeActiveSPCoursesPaginationParams,
  GetActiveSelfPacedCourses,
  ResetActiveSPCoursesState
} from "./active-sp-courses-list.actions";

import { DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  ActiveSelfPacedCourse,
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  IPageable
} from "../../../../../../../../../../libs/shared/src/lib/models";

export class ActiveSpCoursesListStateModel {
  loading: boolean;
  selfPacedCourses: ActiveSelfPacedCourse[];
  total: number;
  paginationParams: IPageable;
}

@State<ActiveSpCoursesListStateModel>({
  name: 'activeSpCoursesList',
  defaults: {
    loading: false,
    selfPacedCourses: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
  }
})
@Injectable()
export class ActiveSpCoursesListState {

  @Selector([ActiveSpCoursesListState])
  static loading(state: ActiveSpCoursesListStateModel) {
    return state.loading;
  }

  @Selector([ActiveSpCoursesListState])
  static selfPacedCourses(state: ActiveSpCoursesListStateModel) {
    return state.selfPacedCourses;
  }

  @Selector([ActiveSpCoursesListState])
  static total(state: ActiveSpCoursesListStateModel) {
    return state.total;
  }

  @Selector([ActiveSpCoursesListState])
  static searchPhrase(state: ActiveSpCoursesListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([ActiveSpCoursesListState])
  static pageIndex(state: ActiveSpCoursesListStateModel) {
    return state.paginationParams.page;
  }

  @Selector([ActiveSpCoursesListState])
  static pageSize(state: ActiveSpCoursesListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly selfPacedCoursesService: SpCoursesService) {
  }

  @Action(GetActiveSelfPacedCourses)
  getActiveSelfPacedCourses({ patchState, getState }: StateContext<ActiveSpCoursesListStateModel>) {
    const { paginationParams } = getState();

    return this.selfPacedCoursesService.getActiveSelfPacedCourses(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ActiveSelfPacedCourse[], flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ selfPacedCourses: resource.response.data, total: resource.response.flags.size });
        }
       })
    );
  }

  @Action(ChangeActiveSPCoursesPaginationParams)
  changeActiveSPCoursesPaginationParams({ patchState, getState }: StateContext<ActiveSpCoursesListStateModel>,
                                        { payload }: ChangeActiveSPCoursesPaginationParams) {
    const { paginationParams } = getState();

    patchState({ paginationParams: {...paginationParams, ...payload.pageable}});
  }

  @Action(ResetActiveSPCoursesState)
  resetActiveSPCoursesState({ patchState }: StateContext<ActiveSpCoursesListStateModel>) {
    patchState({
      loading: false,
      selfPacedCourses: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS
    });
  }
}
