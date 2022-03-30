import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-cta-container-entity-type',
  template: '<ng-content></ng-content>',
  styleUrls: ['./cta-container-entity-type.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaContainerEntityTypeComponent {
}
