import { Component, ChangeDetectionStrategy, Input } from '@angular/core';


@Component({
  selector: 'leap-creation-stepper-step-header',
  templateUrl: './creation-stepper-step-header.component.html',
  styleUrls: ['./creation-stepper-step-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepHeaderComponent {
  @Input() header: string;
}
