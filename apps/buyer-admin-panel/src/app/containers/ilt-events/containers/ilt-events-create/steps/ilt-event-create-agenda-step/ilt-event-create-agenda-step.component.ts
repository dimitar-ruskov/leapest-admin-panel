import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Store } from "@ngxs/store";
import produce from "immer";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

import { GoToEventCreationStep, UpdateILTEventDetails } from "../../state/ilt-events-create.actions";

import {
  ILTCourseAgenda,
  ILTEvent,
  ILTEventCreationStep
} from "../../../../../../../../../../libs/shared/src/lib/models";

@Component({
  selector: 'leap-ilt-event-create-agenda-step',
  templateUrl: './ilt-event-create-agenda-step.component.html',
  styleUrls: ['./ilt-event-create-agenda-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltEventCreateAgendaStepComponent {
  @Input() iltEvent: ILTEvent;
  agendaValueAndValidity: { valid: boolean; value: ILTCourseAgenda; timezone: string };
  agendaEditable = false;
  updating = false;

  constructor(private readonly store: Store) {}

  onAgendaValueAndValidityChange(agendaValueAndValidity: { valid: boolean; value: ILTCourseAgenda; timezone: string }) {
    this.agendaValueAndValidity = agendaValueAndValidity;
  }

  onBack() {
    this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.DETAILS));
  }

  onProceed() {
    const payload = produce(this.iltEvent, (a: ILTEvent) => {
      a.hierarchicalAgenda = this.agendaValueAndValidity.value.days;
      a.classEvent.timezone = this.agendaValueAndValidity.timezone;
    });
    this.updating = true;
    this.store
      .dispatch([new UpdateILTEventDetails(payload, 'agenda')])
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.SCHEDULING));
        },
        () => (this.updating = false),
      );
  }
}
