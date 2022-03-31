import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';

@Injectable()
export class GroupGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly oktaAuthStateService: OktaAuthStateService) {}

  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    const groups = oktaUser['mkpGroups'] || [];
    const allowedGroups = next.data['roles'] as string[];
    const allowed = allowedGroups.some((r) => groups.includes(r));
    if (!allowed) {
      this.router.navigate(['403']);
    }
    return allowed;
  }
}
