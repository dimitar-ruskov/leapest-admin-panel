import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import {
  ILT_COURSE_CREATION_STEPS_LIST,
  ILTCourseCreationStep,
  ILTCourseCreationStepType,
} from '../../../../../../../../../libs/shared/src/lib/models/courses/ilt-courses/ilt-course-create-step.model';
import { IltCoursesService } from '../../../../../../../../../libs/shared/src/lib/services/courses/ilt-courses/ilt-courses.service';
import {
  CancelILTCourseCreation,
  GetPreILTCourse,
  GoToILTCourseCreationStep,
  UpdatePreILTCourse,
} from './ilt-course-create.actions';

import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {PreILTCourse} from "../../../../../../../../../libs/shared/src/lib/models";

export class ILTCourseCreateStateModel {
  currentStep: ILTCourseCreationStepType | null;
  preILTCourse: DeferredResource<PreILTCourse>;
}

@State<ILTCourseCreateStateModel>({
  name: 'iltCourseCreate',
  defaults: {
    currentStep: null,
    preILTCourse: null,
  },
})
@Injectable()
export class ILTCourseCreateState {
  @Selector([ILTCourseCreateState])
  static currentStep(state: ILTCourseCreateStateModel) {
    return state.currentStep;
  }

  @Selector([ILTCourseCreateState])
  static preILTCourse(state: ILTCourseCreateStateModel) {
    return state.preILTCourse;
  }

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly iltCoursesService: IltCoursesService,
  ) {}

  @Action(GetPreILTCourse)
  getPreILTCourse(
    { patchState, getState, dispatch }: StateContext<ILTCourseCreateStateModel>,
    { payload: { id } }: GetPreILTCourse,
  ) {
    return this.iltCoursesService.getPreILTCourse(id).pipe(
      tap((resource: DeferredResource<PreILTCourse>) => {
        patchState({ preILTCourse: resource });

        if (resource.isSuccess) {
          const lastStep = resource.response.tab as ILTCourseCreationStepType;
          const step = ILT_COURSE_CREATION_STEPS_LIST.includes(lastStep) ? lastStep : ILTCourseCreationStep.MATERIALS;

          dispatch(new GoToILTCourseCreationStep({ step }));
        }
      }),
    );
  }

  @Action(UpdatePreILTCourse)
  updatePreILTCourse(
    { patchState, getState, dispatch }: StateContext<ILTCourseCreateStateModel>,
    { payload: { updatedCourse, step } }: UpdatePreILTCourse,
  ) {
    return this.iltCoursesService.updatePreILTCourse(updatedCourse, step).pipe(
      tap((resource: DeferredResource<PreILTCourse>) => {
        if (resource.isSuccess) {
          patchState({ preILTCourse: resource });
        } else if (resource.error) {
          throw new Error(resource.error?.error?.error?.message);
        }
      }),
    );
  }

  @Action(CancelILTCourseCreation)
  cancelILTCourseCreation() {
    this.router.navigate(['admin', 'ilt-courses']);
  }

  @Action(GoToILTCourseCreationStep)
  goToILTCourseCreationStep(
    { patchState, getState, dispatch }: StateContext<ILTCourseCreateStateModel>,
    { payload: { step } }: GoToILTCourseCreationStep,
  ) {
    patchState({ currentStep: step });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step },
      queryParamsHandling: 'merge',
    });
  }
}
