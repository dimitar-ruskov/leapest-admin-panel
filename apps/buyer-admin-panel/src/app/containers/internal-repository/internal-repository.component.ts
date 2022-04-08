import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-internal-repository',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalRepositoryComponent {}
