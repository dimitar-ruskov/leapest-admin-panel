import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  SPCourseCreationStep,
  SPCourseCreationSteps,
  SPCourseCreationStepsList,
} from '../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course-create-step.model';
import { SpCourseCreateState } from './state/sp-course-create.state';
import { GetPreSelfPacedCourse } from './state/sp-course-create.actions';

import { PreSelfPacedCourse } from '../../../../../../../../libs/shared/src/lib/models/courses/sp-courses/sp-course.model';
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-sp-course-create',
  templateUrl: './sp-course-create.component.html',
  styleUrls: ['./sp-course-create.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseCreateComponent implements OnInit {
  readonly steps = SPCourseCreationSteps;
  readonly ids: SPCourseCreationStep[] = SPCourseCreationStepsList;
  readonly stepLabels = {
    [SPCourseCreationSteps.MATERIALS]: 'Materials',
    [SPCourseCreationSteps.DETAILS]: 'Course Details',
    [SPCourseCreationSteps.SUMMARY]: 'Summary',
  };

  @Select(SpCourseCreateState.currentStep)
  currentStep$: Observable<SPCourseCreationStep>;

  @Select(SpCourseCreateState.preSelfPacedCourse)
  preSelfPacedCourse$: Observable<DeferredResource<PreSelfPacedCourse>>;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store) {}

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.store.dispatch(new GetPreSelfPacedCourse({ id: params.id }));
    });
  }

  getStepIndex(step: SPCourseCreationStep): number {
    return this.ids.findIndex((s) => s === step);
  }
}
