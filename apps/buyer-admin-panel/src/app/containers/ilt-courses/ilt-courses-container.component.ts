import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'leap-ilt-courses-container',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IltCoursesContainerComponent {}

