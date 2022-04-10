import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ILTEventCreationStep } from './models/ilt-event-create-step.model';
import { GetILTEventDetails, ResetEventBase } from './state/ilt-events-create.actions';
import { IltEventsCreateState } from './state/ilt-events-create.state';

import {ILTEvent, ILTEventBase} from "../../../../../../../../libs/shared/src/lib/models/interfaces";
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {EnvironmentService} from "../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-ilt-events-create',
  templateUrl: './ilt-events-create.component.html',
  styleUrls: ['./ilt-events-create.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventsCreateComponent implements OnInit, OnDestroy {
  readonly steps = [
    ILTEventCreationStep.MATERIALS,
    ILTEventCreationStep.DETAILS,
    ILTEventCreationStep.AGENDA,
    ILTEventCreationStep.SCHEDULING,
    ILTEventCreationStep.SUMMARY,
  ];

  ILTEventCreationStep = ILTEventCreationStep;
  @Select(IltEventsCreateState.iltEventCreationStep)
  iltEventCreationStep$: Observable<ILTEventCreationStep>;

  @Select(IltEventsCreateState.iltEvent)
  iltEvent$: Observable<DeferredResource<ILTEvent>>;

  @Select(IltEventsCreateState.iltEventBase)
  iltEventBase$: Observable<ILTEventBase>;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.store.dispatch(new GetILTEventDetails(params['sku']));
    });
  }

  stepIndex(step: ILTEventCreationStep): number {
    return this.steps.findIndex((s) => s === step);
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetEventBase());
  }
}
