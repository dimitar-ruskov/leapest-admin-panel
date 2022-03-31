import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';

@Injectable()
export class HybridUserGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly oktaAuthStateService: OktaAuthStateService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    const hybrid = oktaUser['hybrid'];
    const allowed = true || hybrid; // TODO: enable the hybrid fglag in the OKTA claims
    if (!allowed) {
      this.router.navigate(['403']);
    }

    return allowed;
  }
}
