import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { Action, Selector, State, StateContext } from "@ngxs/store";

import { ChangeILTCoursesListTab, CreatePreILTCourse, ScheduleILTCourseEvent } from "./ilt-courses-list.actions";
import { PublishedILTCoursesState } from "../published-ilt-courses-list/state/published-ilt-courses.state";
import { DraftILTCoursesState } from "../draft-ilt-courses-list/state/draft-ilt-courses.state";
import {
  IltCoursesService
} from "../../../../../../../../../libs/shared/src/lib/services/courses/ilt-courses/ilt-courses.service";

import { ILTEvent, PreILTCourse } from "../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";

export class ILTCoursesListStateModel {
  activeTab: number;
}

@State<ILTCoursesListStateModel>({
  name: 'iltCoursesList',
  defaults: {
    activeTab: 0,
  },
  children: [PublishedILTCoursesState, DraftILTCoursesState],
})
@Injectable()
export class IltCoursesListState {
  @Selector([IltCoursesListState])
  static activeTab(state: ILTCoursesListStateModel) {
    return state.activeTab;
  }

  constructor(private readonly iltCoursesService: IltCoursesService, private readonly router: Router) {}

  @Action(ChangeILTCoursesListTab)
  changeILTCoursesListTab(
    { patchState, getState, dispatch }: StateContext<ILTCoursesListStateModel>,
    { payload: { activeTab } }: ChangeILTCoursesListTab,
  ) {
    patchState({ activeTab });
  }

  //@TODO move to parent state
  @Action(CreatePreILTCourse)
  createPreILTCourse(
    { patchState, getState, dispatch }: StateContext<ILTCoursesListStateModel>,
    action: CreatePreILTCourse,
  ) {
    const { updatedCourse } = action.payload;

    return this.iltCoursesService.updatePreILTCourse(updatedCourse, 'prestepper').pipe(
      tap((resource: DeferredResource<PreILTCourse>) => {
        if (resource.isSuccess) {
          this.router.navigate(['/admin', 'ilt-courses', 'create', resource.response.id]);
        }
      }),
    );
  }

  //@TODO move to parent state
  @Action(ScheduleILTCourseEvent)
  scheduleILTCourseEvent(
    { patchState, getState, dispatch }: StateContext<ILTCoursesListStateModel>,
    { payload: { preCourseEvent } }: ScheduleILTCourseEvent,
  ) {
    return this.iltCoursesService.scheduleILTCourseEvent(preCourseEvent).pipe(
      tap((resource: DeferredResource<ILTEvent>) => {
        if (resource.isSuccess) {
          this.router.navigate(['admin', 'ilt-events', 'create', resource.response.sku]);
        }
      }),
    );
  }
}
