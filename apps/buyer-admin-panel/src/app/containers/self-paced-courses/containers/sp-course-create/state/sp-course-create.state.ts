import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs/operators";

import {
  CancelSPCourseCreation,
  GetPreSelfPacedCourse,
  GoToSPCourseCreationStep,
  UpdatePreSelfPacedCourse
} from "./sp-course-create.actions";
import {
  SpCoursesService
} from "../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-courses.service";
import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  PreSelfPacedCourse,
  SPCourseCreationStep,
  SPCourseCreationSteps,
  SPCourseCreationStepsList
} from "../../../../../../../../../libs/shared/src/lib/models";


export class SpCourseCreateStateModel {
  currentStep: SPCourseCreationStep | null;
  preSelfPacedCourse: DeferredResource<PreSelfPacedCourse>;
}

@State<SpCourseCreateStateModel>({
  name: 'SpCourseCreate',
  defaults: {
    currentStep: null,
    preSelfPacedCourse: null
  }
})
@Injectable()
export class SpCourseCreateState {

  @Selector([SpCourseCreateState])
  static currentStep(state: SpCourseCreateStateModel) {
    return state.currentStep;
  }

  @Selector([SpCourseCreateState])
  static preSelfPacedCourse(state: SpCourseCreateStateModel) {
    return state.preSelfPacedCourse;
  }

  constructor(private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly selfPacedCoursesService: SpCoursesService
  ) {
  }

  @Action(GetPreSelfPacedCourse)
  getPreSPCourse({ patchState, getState, dispatch }: StateContext<SpCourseCreateStateModel>,
                 action: GetPreSelfPacedCourse) {
    const { id } = action.payload;

    return this.selfPacedCoursesService.getPreSelfPacedCourse(id).pipe(
      tap((resource: DeferredResource<PreSelfPacedCourse>) => {
        patchState({ preSelfPacedCourse: resource });

        if (resource.isSuccess) {
          const lastStep = resource.response.tab;
          const step = SPCourseCreationStepsList.includes(lastStep) ? lastStep : SPCourseCreationSteps.MATERIALS;

          dispatch(new GoToSPCourseCreationStep({ step }));
        }
      })
    );
  }

  @Action(UpdatePreSelfPacedCourse)
  updatePreSelfPacedCourse({ patchState, getState, dispatch }: StateContext<SpCourseCreateStateModel>,
                           action: UpdatePreSelfPacedCourse) {
    const { updatedCourse, step } = action.payload;

    return this.selfPacedCoursesService.updatePreSelfPacedCourse(updatedCourse, step).pipe(
      tap((resource: DeferredResource<PreSelfPacedCourse>) => {
        if (resource.isSuccess) {
          patchState({ preSelfPacedCourse: resource });
        }
      })
    );
  }

  @Action(CancelSPCourseCreation)
  cancelSPCourseCreation() {
    this.router.navigate(['admin', 'self-paced-courses']);
  }

  @Action(GoToSPCourseCreationStep)
  goToCourseCreationStep(
    { patchState, getState, dispatch }: StateContext<SpCourseCreateStateModel>,
    action: GoToSPCourseCreationStep
  ) {
    const { step } = action.payload;

    patchState({ currentStep: step });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step },
      queryParamsHandling: 'merge'
    });
  }
}
