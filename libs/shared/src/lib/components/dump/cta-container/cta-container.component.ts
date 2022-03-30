import { Component, ChangeDetectionStrategy, Input, ContentChild } from '@angular/core';
import { CtaContainerImageDirective } from './cta-container-image.directive';
import { CtaContainerEntityTypeComponent } from './cta-container-entity-type/cta-container-entity-type.component';


@Component({
  selector: 'leap-cta-container',
  templateUrl: './cta-container.component.html',
  styleUrls: ['./cta-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaContainerComponent {
  @Input() skeleton: boolean;

  @ContentChild(CtaContainerImageDirective)
  ctaContainerImage: CtaContainerImageDirective;

  @ContentChild(CtaContainerEntityTypeComponent)
  ctaContainerEntityType: CtaContainerEntityTypeComponent;

  constructor() { }
}
