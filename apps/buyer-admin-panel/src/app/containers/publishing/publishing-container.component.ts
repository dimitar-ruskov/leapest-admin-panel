import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-publish-settings-container',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishingContainerComponent {}
