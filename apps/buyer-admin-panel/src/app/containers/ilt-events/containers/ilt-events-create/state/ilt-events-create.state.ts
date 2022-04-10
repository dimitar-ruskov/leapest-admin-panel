import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { IltEventsService } from '../../../services/ilt-events.service';
import { ILTEventCreationStep } from '../models/ilt-event-create-step.model';
import {
  GetILTEventDetails,
  GoToEventCreationStep,
  ResetEventBase,
  UpdateILTEventDetails,
} from './ilt-events-create.actions';

import {ILTEvent, ILTEventBase} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {DeferredResource} from "../../../../../../../../../libs/shared/src/lib/utils/common";

export class IltEventsCreateStateModel {
  iltEvent: DeferredResource<ILTEvent>;
  iltEventBase: ILTEventBase;
  iltEventCreationStep: ILTEventCreationStep;
}

@State<IltEventsCreateStateModel>({
  name: 'iltEventsCreate',
  defaults: {
    iltEvent: undefined,
    iltEventCreationStep: undefined,
    iltEventBase: undefined,
  },
})
@Injectable()
export class IltEventsCreateState {
  @Selector([IltEventsCreateState])
  static iltEventCreationStep(state: IltEventsCreateStateModel) {
    return state.iltEventCreationStep;
  }

  @Selector([IltEventsCreateState])
  static iltEvent(state: IltEventsCreateStateModel) {
    return state.iltEvent;
  }

  @Selector([IltEventsCreateState])
  static iltEventBase(state: IltEventsCreateStateModel) {
    return state.iltEventBase;
  }

  constructor(
    private readonly service: IltEventsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  @Action(GetILTEventDetails)
  getILTEventDetails({ patchState, getState }: StateContext<IltEventsCreateStateModel>, { id }: GetILTEventDetails) {
    return this.service.getILTEventDetails(id).pipe(
      tap((iltEvent: DeferredResource<ILTEvent>) => {
        patchState({ iltEvent });
        if (iltEvent.isSuccess) {
          patchState({
            iltEventBase: {
              classEvent: { virtualVenue: iltEvent.response.classEvent.virtualVenue },
              course: {
                id: iltEvent.response.course.id,
                name: iltEvent.response.course.name,
                publishStatus: iltEvent.response.course.publishStatus.configKey,
                parentId: iltEvent.response.course.parentId,
              },
              historical: iltEvent.response.historical,
              isInternal: true,
            },
          });
          if (this.route.snapshot.queryParams['zoomRedirect']) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { zoomRedirect: null },
              queryParamsHandling: 'merge',
              replaceUrl: true,
            });
            patchState({ iltEventCreationStep: ILTEventCreationStep.SCHEDULING });
          } else {
            switch (iltEvent.response.step) {
              case 'materials': {
                patchState({ iltEventCreationStep: ILTEventCreationStep.MATERIALS });
                break;
              }
              case 'details': {
                patchState({ iltEventCreationStep: ILTEventCreationStep.DETAILS });
                break;
              }
              case 'agenda': {
                patchState({ iltEventCreationStep: ILTEventCreationStep.AGENDA });
                break;
              }
              case 'scheduling': {
                patchState({ iltEventCreationStep: ILTEventCreationStep.SCHEDULING });
                break;
              }
              case 'summary': {
                patchState({ iltEventCreationStep: ILTEventCreationStep.SUMMARY });
                break;
              }
              default: {
                patchState({
                  iltEventCreationStep: iltEvent.response.historical
                    ? ILTEventCreationStep.DETAILS
                    : ILTEventCreationStep.MATERIALS,
                });
                break;
              }
            }
          }
        }
      }),
    );
  }

  @Action(UpdateILTEventDetails)
  updateILTEventDetails(
    { patchState, getState }: StateContext<IltEventsCreateStateModel>,
    { data, key }: UpdateILTEventDetails,
  ) {
    return this.service.updateILTEventDetails(data, key).pipe(
      tap((iltEvent: DeferredResource<ILTEvent>) => {
        if (iltEvent.isSuccess) {
          patchState({ iltEvent });
        }
      }),
    );
  }

  @Action(ResetEventBase)
  resetEventBase({ patchState, setState }: StateContext<IltEventsCreateStateModel>) {
    patchState({ iltEventBase: undefined });
  }

  @Action(GoToEventCreationStep)
  goToEventCreationStep({ patchState }: StateContext<IltEventsCreateStateModel>, { step }: GoToEventCreationStep) {
    patchState({ iltEventCreationStep: step });
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        step: step,
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      // skipLocationChange: true
      // do not trigger navigation
    });
  }
}
