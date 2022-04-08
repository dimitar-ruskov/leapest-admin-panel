import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-certificates',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesComponent {}
