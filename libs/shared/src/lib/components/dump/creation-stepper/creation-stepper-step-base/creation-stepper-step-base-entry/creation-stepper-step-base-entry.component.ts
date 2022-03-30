import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-base-entry',
  templateUrl: './creation-stepper-step-base-entry.component.html',
  styleUrls: ['./creation-stepper-step-base-entry.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepBaseEntryComponent {
  @Input() label: string;
  @Input() value: string;
}
