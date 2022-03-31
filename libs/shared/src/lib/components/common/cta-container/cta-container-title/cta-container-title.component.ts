import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'h1[leap-cta-container-title]',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      font-size: 18px;
      line-height: 24px;
      color: #26273b;
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaContainerTitleComponent {
}
