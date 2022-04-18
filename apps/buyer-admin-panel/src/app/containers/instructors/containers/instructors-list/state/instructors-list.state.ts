import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import { ChangeInstructorsPaginationParams, GetInstructors, ResetInstructorsState } from "./instructors-list.actions";
import {
  InstructorsService
} from "../../../../../../../../../libs/shared/src/lib/services/instructors/instructors.service";

import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  InstructorLite,
  IPageable
} from "../../../../../../../../../libs/shared/src/lib/models";

export class InstructorsListStateModel {
  loading: boolean;
  instructors: InstructorLite[];
  total: number;
  paginationParams: IPageable;
}
@State<InstructorsListStateModel>({
  name: 'instructorsList',
  defaults: {
    loading: false,
    instructors: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class InstructorsListState {
  @Selector()
  static loading(state: InstructorsListStateModel) {
    return state.loading;
  }

  @Selector()
  static instructors(state: InstructorsListStateModel) {
    return state.instructors;
  }

  @Selector()
  static total(state: InstructorsListStateModel) {
    return state.total;
  }

  @Selector()
  static searchPhrase(state: InstructorsListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector()
  static pageIndex(state: InstructorsListStateModel) {
    return state.paginationParams.page;
  }

  @Selector()
  static pageSize(state: InstructorsListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly instructorsService: InstructorsService) {}

  @Action(GetInstructors)
  getInstructors({ patchState, getState }: StateContext<InstructorsListStateModel>) {
    const { paginationParams } = getState();

    return this.instructorsService.getInstructors(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: InstructorLite[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ instructors: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeInstructorsPaginationParams)
  changeInstructorsPaginationParams(
    { patchState, getState }: StateContext<InstructorsListStateModel>,
    { payload }: ChangeInstructorsPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetInstructorsState)
  resetInstructorsState({ patchState }: StateContext<InstructorsListStateModel>) {
    patchState({
      loading: false,
      instructors: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
