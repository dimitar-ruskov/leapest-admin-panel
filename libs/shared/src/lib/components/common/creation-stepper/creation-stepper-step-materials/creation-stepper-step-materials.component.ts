import { Component, ChangeDetectionStrategy, Input, TemplateRef, ContentChild, TrackByFunction } from '@angular/core';


@Component({
  selector: 'leap-creation-stepper-step-materials',
  templateUrl: './creation-stepper-step-materials.component.html',
  styleUrls: ['./creation-stepper-step-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreationStepperStepMaterialsComponent {
  @Input() materials: any = [];

  @ContentChild('noMaterialsTemplate') noMaterialsTemplate: TemplateRef<any>;
  @ContentChild('materialTemplate') materialTemplate: TemplateRef<any>;

  trackByFn: TrackByFunction<any> = (index) => index;
}
