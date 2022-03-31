import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';

@Injectable()
export class AdminUserGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly oktaAuthStateService: OktaAuthStateService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    const allowed = oktaUser['mkpGroups'].includes('buyer-admin');
    if (!allowed) {
      this.router.navigate(['403']);
    }

    return allowed;
  }
}
