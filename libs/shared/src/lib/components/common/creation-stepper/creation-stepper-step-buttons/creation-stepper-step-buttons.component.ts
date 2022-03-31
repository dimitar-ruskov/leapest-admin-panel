import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-buttons',
  template: '<ng-content></ng-content>',
  styleUrls: ['./creation-stepper-step-buttons.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepButtonsComponent {
}
