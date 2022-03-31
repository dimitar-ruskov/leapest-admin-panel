import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-base-header',
  templateUrl: './creation-stepper-step-base-header.component.html',
  styleUrls: ['./creation-stepper-step-base-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepBaseHeaderComponent {
  @Input() label = 'You are now creating:';
  @Input() entityName: string;
}
