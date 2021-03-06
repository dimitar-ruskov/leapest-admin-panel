import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";

import {
  ChangeSelfPacedCoursesListTab,
  CreatePreSelfPacedCourse,
  GetFullLanguageDictionary
} from "./sp-courses-list.actions";
import {
  SpCoursesService
} from "../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-courses.service";
import { IKeyValuePair, PreSelfPacedCourse } from "../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import { DraftSpCoursesListState } from "../draft-sp-courses-list/state/draft-sp-courses-list.state";
import { ActiveSpCoursesListState } from "../active-sp-courses-list/state/active-sp-courses-list.state";


export class SpCoursesListStateModel {
  activeTab: number;
  languageDictionary: IKeyValuePair[];
}

@State<SpCoursesListStateModel>({
  name: 'spCoursesList',
  defaults: {
    activeTab: 0,
    languageDictionary: []
  },
  children: [ActiveSpCoursesListState, DraftSpCoursesListState]
})
@Injectable()
export class SpCoursesListState {

  @Selector([SpCoursesListState])
  static activeTab(state: SpCoursesListStateModel) {
    return state.activeTab;
  }

  @Selector([SpCoursesListState])
  static languageDictionary(state: SpCoursesListStateModel) {
    return state.languageDictionary;
  }

  constructor(private readonly selfPacedCoursesService: SpCoursesService,
              private readonly router: Router
  ) {
  }

  @Action(ChangeSelfPacedCoursesListTab)
  changeSelfPacedCoursesListTab(
    { patchState, getState, dispatch }: StateContext<SpCoursesListStateModel>,
    action: ChangeSelfPacedCoursesListTab
  ) {
    const { activeTab } = action.payload;

    patchState({ activeTab });
  }

  @Action(GetFullLanguageDictionary)
  getFullLanguageDictionary(
    { patchState }: StateContext<SpCoursesListStateModel>
  ) {
    return this.selfPacedCoursesService.getFullLanguageDictionary()
      .pipe(tap((resource) => {
          if (resource.isSuccess) {
            const response = resource.response.data;

            patchState({languageDictionary: response});
          }
      }));
  }

  @Action(CreatePreSelfPacedCourse)
  createPreSelfPacedCourse({ patchState, getState, dispatch }: StateContext<SpCoursesListStateModel>,
                           action: CreatePreSelfPacedCourse) {
    const { updatedCourse } = action.payload;

    return this.selfPacedCoursesService.updatePreSelfPacedCourse(updatedCourse, 'prestepper').pipe(
      tap((resource: DeferredResource<PreSelfPacedCourse>) => {
        if (resource.isSuccess) {
          this.router.navigate(['/admin', 'self-paced-courses', 'create', resource.response.id]);
        }
      })
    );
  }
}

