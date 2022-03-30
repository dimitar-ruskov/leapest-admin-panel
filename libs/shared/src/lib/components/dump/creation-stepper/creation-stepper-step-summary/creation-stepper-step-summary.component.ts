import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-summary',
  template: '<ng-content></ng-content>',
  styleUrls: ['./creation-stepper-step-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepSummaryComponent {
}
