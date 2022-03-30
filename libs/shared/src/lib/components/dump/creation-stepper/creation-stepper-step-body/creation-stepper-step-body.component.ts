import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-body',
  template: '<ng-content></ng-content>',
  styleUrls: ['./creation-stepper-step-body.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepBodyComponent {
}
