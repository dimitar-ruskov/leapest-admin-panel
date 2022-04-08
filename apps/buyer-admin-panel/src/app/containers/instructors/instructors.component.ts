import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-instructors',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorsComponent {}
