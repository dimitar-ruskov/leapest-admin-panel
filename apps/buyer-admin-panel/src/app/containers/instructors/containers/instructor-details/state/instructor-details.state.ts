import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  ChangeInstructorDetailsPaginationParams,
  GetEvents,
  GetInstructor,
  ResetInstructorDetailsState,
  UpdateInstructor
} from "./instructor-details.actions";
import {
  InstructorsService
} from "../../../../../../../../../libs/shared/src/lib/services/instructors/instructors.service";

import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  ILTEventListItem,
  InstructorLite,
  IPageable
} from "../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";

export class InstructorDetailsStateModel {
  loading: boolean;
  instructor: DeferredResource<InstructorLite> | null;
  instructorEvents: ILTEventListItem[];
  total: number;
  paginationParams: IPageable;
}

@State<InstructorDetailsStateModel>({
  name: 'instructorDetails',
  defaults: {
    loading: false,
    instructor: null,
    instructorEvents: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class InstructorDetailsState {
  @Selector()
  static loading(state: InstructorDetailsStateModel) {
    return state.loading;
  }

  @Selector()
  static instructor(state: InstructorDetailsStateModel) {
    return state.instructor;
  }

  @Selector()
  static instructorEvents(state: InstructorDetailsStateModel) {
    return state.instructorEvents;
  }

  @Selector()
  static total(state: InstructorDetailsStateModel) {
    return state.total;
  }

  @Selector()
  static searchPhrase(state: InstructorDetailsStateModel) {
    return state.paginationParams.filter;
  }

  @Selector()
  static pageIndex(state: InstructorDetailsStateModel) {
    return state.paginationParams.page;
  }

  @Selector()
  static pageSize(state: InstructorDetailsStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly service: InstructorsService) {}

  @Action(GetInstructor)
  getInstructor({ patchState }: StateContext<InstructorDetailsStateModel>, action: GetInstructor) {
    const { id } = action.payload;
    return this.service.getInstructorDetails(id).pipe(
      tap((resource: DeferredResource<InstructorLite>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ instructor: resource });
        }
      }),
    );
  }

  @Action(UpdateInstructor)
  updateInstructor({ patchState }: StateContext<InstructorDetailsStateModel>, action: UpdateInstructor) {
    const { instructor } = action.payload;
    return this.service.updateInstructor(instructor).pipe(
      tap((resource: DeferredResource<InstructorLite>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ instructor: resource });
        } else if (resource.error) {
          throw new Error(resource.error?.message);
        }
      }),
    );
  }

  @Action(GetEvents)
  getEvents({ patchState, getState }: StateContext<InstructorDetailsStateModel>, action: GetEvents) {
    const { id, state } = action.payload;
    const { paginationParams } = getState();
    return this.service.getEvents(id, state, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: ILTEventListItem[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ instructorEvents: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeInstructorDetailsPaginationParams)
  changeInstructorDetailsPaginationParams(
    { patchState, getState }: StateContext<InstructorDetailsStateModel>,
    { payload }: ChangeInstructorDetailsPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetInstructorDetailsState)
  resetActiveSPCoursesState({ patchState }: StateContext<InstructorDetailsStateModel>) {
    patchState({
      loading: false,
      instructor: null,
      instructorEvents: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
