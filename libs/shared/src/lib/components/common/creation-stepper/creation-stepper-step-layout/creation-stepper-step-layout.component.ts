import { Component, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { CreationStepperStepHeaderComponent } from '../creation-stepper-step-header/creation-stepper-step-header.component';
import { CreationStepperStepBodyComponent } from '../creation-stepper-step-body/creation-stepper-step-body.component';
import { CreationStepperStepButtonsComponent } from '../creation-stepper-step-buttons/creation-stepper-step-buttons.component';

@Component({
  selector: 'leap-creation-stepper-step-layout',
  templateUrl: './creation-stepper-step-layout.component.html',
  styleUrls: ['./creation-stepper-step-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepLayoutComponent {
  @ContentChild(CreationStepperStepHeaderComponent) header: CreationStepperStepHeaderComponent;
  @ContentChild(CreationStepperStepBodyComponent) body: CreationStepperStepBodyComponent;
  @ContentChild(CreationStepperStepButtonsComponent) buttons: CreationStepperStepButtonsComponent;
}
