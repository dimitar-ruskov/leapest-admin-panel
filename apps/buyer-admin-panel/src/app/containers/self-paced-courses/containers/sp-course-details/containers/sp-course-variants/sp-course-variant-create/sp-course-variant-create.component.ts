import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

import { SpCourseVariantCreateState } from "./state/sp-course-variant-create.state";
import { GetPreSPCourseLanguageVariant } from "./state/sp-course-variant-create.actions";

import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  PreSPCourseLanguageVariant,
  SPCourseCreationSteps,
  SPCourseLanguageVariantCreationStep,
  SPCourseLanguageVariantCreationSteps,
  SPCourseLanguageVariantCreationStepsList
} from "../../../../../../../../../../../libs/shared/src/lib/models";

@Component({
  selector: 'leap-sp-course-variant-create',
  templateUrl: './sp-course-variant-create.component.html',
  styleUrls: ['./sp-course-variant-create.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseVariantCreateComponent implements OnInit {
  readonly steps = SPCourseLanguageVariantCreationSteps;
  readonly ids: SPCourseLanguageVariantCreationStep[] = SPCourseLanguageVariantCreationStepsList;
  readonly stepLabels = {
    [SPCourseCreationSteps.MATERIALS]: 'Materials & Certificates',
    [SPCourseCreationSteps.DETAILS]: 'Variant Details',
    [SPCourseCreationSteps.SUMMARY]: 'Summary',
  };

  @Select(SpCourseVariantCreateState.currentStep)
  currentStep$: Observable<SPCourseLanguageVariantCreationStep>;

  @Select(SpCourseVariantCreateState.preSPCourseLanguageVariant)
  preSPCourseLanguageVariant$: Observable<DeferredResource<PreSPCourseLanguageVariant>>;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((paramMap: ParamMap) => {
      this.store.dispatch(new GetPreSPCourseLanguageVariant({ id: paramMap.get('variantId') }));
    });
  }

  getStepIndex(step: SPCourseLanguageVariantCreationStep): number {
    return this.ids.findIndex((s) => s === step);
  }
}
