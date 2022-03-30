import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-creation-stepper-step-section',
  template: '<ng-content></ng-content>',
  styleUrls: ['./creation-stepper-step-section.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepSectionComponent {
}
