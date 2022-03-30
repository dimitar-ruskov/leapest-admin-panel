import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-info',
  template: '<ng-content></ng-content>',
  styleUrls: ['./creation-stepper-step-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepInfoComponent {
}
