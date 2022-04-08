import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-marketplace-repository',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketplaceRepositoryComponent {}
