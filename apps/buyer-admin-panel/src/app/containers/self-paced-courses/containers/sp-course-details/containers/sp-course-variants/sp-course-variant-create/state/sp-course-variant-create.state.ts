import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  CreatePreSPCourseLanguageVariant,
  GetPreSPCourseLanguageVariant,
  GoToSPCourseLanguageVariantCreationStep,
  UpdatePreSPCourseLanguageVariant
} from "./sp-course-variant-create.actions";
import {
  SpCourseLanguageVariantsService
} from "../../../../../../../../../../../../libs/shared/src/lib/services/courses/sp-courses/sp-course-language-variants.service";
import { DeferredResource } from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  PreSPCourseLanguageVariant,
  SPCourseLanguageVariantCreationStep,
  SPCourseLanguageVariantCreationSteps
} from "../../../../../../../../../../../../libs/shared/src/lib/models";


export class SpCourseVariantCreateStateModel {
  currentStep: SPCourseLanguageVariantCreationStep | null;
  preSPCourseLanguageVariant: DeferredResource<PreSPCourseLanguageVariant>;
}

@State<SpCourseVariantCreateStateModel>({
  name: 'spCourseVariantCreate',
  defaults: {
    currentStep: null,
    preSPCourseLanguageVariant: null
  }
})
@Injectable()
export class SpCourseVariantCreateState {

  @Selector([SpCourseVariantCreateState])
  static currentStep(state: SpCourseVariantCreateStateModel) {
    return state.currentStep;
  }

  @Selector([SpCourseVariantCreateState])
  static preSPCourseLanguageVariant(state: SpCourseVariantCreateStateModel) {
    return state.preSPCourseLanguageVariant;
  }

  constructor(private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly spCourseLanguageVariantsService: SpCourseLanguageVariantsService
  ) {
  }

  @Action(GetPreSPCourseLanguageVariant)
  getPreSelfPacedCourse({ patchState, getState, dispatch }: StateContext<SpCourseVariantCreateStateModel>,
                        action: GetPreSPCourseLanguageVariant
  ) {
    const { id } = action.payload;

    return this.spCourseLanguageVariantsService.getPreSPCourseLanguageVariant(id).pipe(
      tap((resource: DeferredResource<PreSPCourseLanguageVariant>) => {
        patchState({ preSPCourseLanguageVariant: resource });

        if (resource.isSuccess) {
          dispatch(new GoToSPCourseLanguageVariantCreationStep({ step: SPCourseLanguageVariantCreationSteps.MATERIALS }));
        }
      })
    );
  }

  @Action(CreatePreSPCourseLanguageVariant)
  createPreSelfPacedCourse({ patchState, getState, dispatch }: StateContext<SpCourseVariantCreateStateModel>,
                           action: CreatePreSPCourseLanguageVariant
  ) {
    const { preSPCourseLanguageVariant, courseId } = action.payload;

    return this.spCourseLanguageVariantsService.createPreSPCourseLanguageVariant(preSPCourseLanguageVariant).pipe(
      tap((resource: DeferredResource<PreSPCourseLanguageVariant>) => {
        if (resource.isSuccess) {
          const variant = resource.response;

          patchState({ preSPCourseLanguageVariant: resource });
          this.router.navigate([
            '/admin',
            'self-paced-courses',
            'details',
            courseId,
            'create-new-variant',
            variant.id
          ]);
        }
      })
    );
  }

  @Action(GoToSPCourseLanguageVariantCreationStep)
  goToSPCourseLanguageVariantCreationStep(
    { patchState, getState, dispatch }: StateContext<SpCourseVariantCreateStateModel>,
    action: GoToSPCourseLanguageVariantCreationStep
  ) {
    const { step } = action.payload;

    patchState({ currentStep: step });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step },
      queryParamsHandling: 'merge'
    });
  }

  @Action(UpdatePreSPCourseLanguageVariant)
  updatePreSPCourseLanguageVariant(
    { patchState, dispatch }: StateContext<SpCourseVariantCreateStateModel>,
    action: UpdatePreSPCourseLanguageVariant
  ) {
    const { updatedPreSPCourseLanguageVariant, step } = action.payload;

    return this.spCourseLanguageVariantsService.updatePreSPCourseLanguageVariant(updatedPreSPCourseLanguageVariant, step)
      .pipe(tap((resource) => {
        if (resource.isSuccess) {
          patchState({preSPCourseLanguageVariant: resource});
        }
      }));
  }
}
