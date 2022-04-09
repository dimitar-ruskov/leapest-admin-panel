import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import {
  ILT_COURSE_CREATION_STEPS_LIST,
  ILTCourseCreationStep,
  ILTCourseCreationStepType,
} from './models/ilt-course-create-step.model';
import { ILTCourseCreateState } from './state/ilt-course-create.state';
import { GetPreILTCourse } from './state/ilt-course-create.actions';

import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {PreILTCourse} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

@Component({
  selector: 'leap-ilt-course-create',
  templateUrl: './ilt-course-create.component.html',
  styleUrls: ['./ilt-course-create.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseCreateComponent implements OnInit {
  readonly steps = ILTCourseCreationStep;
  readonly ids = ILT_COURSE_CREATION_STEPS_LIST;
  readonly stepLabels = {
    [ILTCourseCreationStep.MATERIALS]: 'Materials',
    [ILTCourseCreationStep.DETAILS]: 'Course Details',
    [ILTCourseCreationStep.AGENDA]: 'Agenda',
    [ILTCourseCreationStep.SUMMARY]: 'Summary',
  };

  @Select(ILTCourseCreateState.currentStep)
  currentStep$: Observable<ILTCourseCreationStepType>;

  @Select(ILTCourseCreateState.preILTCourse)
  preILTCourse$: Observable<DeferredResource<PreILTCourse>>;

  constructor(private readonly store: Store, private readonly route: ActivatedRoute) {}

  getStepIndex(step: ILTCourseCreationStepType): number {
    return this.ids.findIndex((s) => s === step);
  }

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.store.dispatch(new GetPreILTCourse({ id: params.id }));
    });
  }
}
