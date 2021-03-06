import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-notifications',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent {}
