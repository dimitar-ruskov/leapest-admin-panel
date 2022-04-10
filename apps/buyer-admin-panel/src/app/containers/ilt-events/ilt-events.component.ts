import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-ilt-events',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IltEventsComponent {}
