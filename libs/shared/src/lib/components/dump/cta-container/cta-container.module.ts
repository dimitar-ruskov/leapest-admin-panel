import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtaContainerComponent } from './cta-container.component';
import { CtaContainerTitleComponent } from './cta-container-title/cta-container-title.component';
import { CtaContainerDescriptionComponent } from './cta-container-description/cta-container-description.component';
import { CtaContainerImageDirective } from './cta-container-image.directive';
import { CtaContainerEntityTypeComponent } from './cta-container-entity-type/cta-container-entity-type.component';


@NgModule({
  declarations: [
    CtaContainerComponent,
    CtaContainerTitleComponent,
    CtaContainerDescriptionComponent,
    CtaContainerEntityTypeComponent,
    CtaContainerImageDirective,
  ],
  exports: [
    CtaContainerComponent,
    CtaContainerTitleComponent,
    CtaContainerDescriptionComponent,
    CtaContainerEntityTypeComponent,
    CtaContainerImageDirective,
  ],
  imports: [
    CommonModule
  ]
})
export class CtaContainerModule {
}
