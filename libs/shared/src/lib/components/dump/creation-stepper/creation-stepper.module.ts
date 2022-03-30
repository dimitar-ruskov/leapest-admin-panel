import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreationStepperStepHeaderComponent } from './creation-stepper-step-header/creation-stepper-step-header.component';
import { CreationStepperStepButtonsComponent } from './creation-stepper-step-buttons/creation-stepper-step-buttons.component';
import { CreationStepperStepMaterialsComponent } from './creation-stepper-step-materials/creation-stepper-step-materials.component';
import { CreationStepperStepSectionComponent } from './creation-stepper-step-section/creation-stepper-step-section.component';
import { CreationStepperStepLayoutComponent } from './creation-stepper-step-layout/creation-stepper-step-layout.component';
import { CreationStepperStepBodyComponent } from './creation-stepper-step-body/creation-stepper-step-body.component';
import { CreationStepperStepSummaryComponent } from './creation-stepper-step-summary/creation-stepper-step-summary.component';
import { CreationStepperStepInfoComponent } from './creation-stepper-step-info/creation-stepper-step-info.component';
import { CreationStepperStepBaseComponent } from './creation-stepper-step-base/creation-stepper-step-base.component';
import { CreationStepperStepBaseEntryComponent } from './creation-stepper-step-base/creation-stepper-step-base-entry/creation-stepper-step-base-entry.component';
import { CreationStepperStepBaseHeaderComponent } from './creation-stepper-step-base/creation-stepper-step-base-header/creation-stepper-step-base-header.component';

const components = [
  CreationStepperStepHeaderComponent,
  CreationStepperStepButtonsComponent,
  CreationStepperStepMaterialsComponent,
  CreationStepperStepSectionComponent,
  CreationStepperStepLayoutComponent,
  CreationStepperStepBodyComponent,
  CreationStepperStepSummaryComponent,
  CreationStepperStepInfoComponent,
  CreationStepperStepBaseComponent,
  CreationStepperStepBaseEntryComponent,
  CreationStepperStepBaseHeaderComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule
  ]
})
export class CreationStepperModule { }
