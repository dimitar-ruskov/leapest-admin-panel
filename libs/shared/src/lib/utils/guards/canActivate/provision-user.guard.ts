import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';

import {EnvironmentService} from "../../../services/common/environment.service";

@Injectable()
export class ProvisionUserGuard implements CanDeactivate<any> {
  constructor(
    private readonly oktaAuthStateService: OktaAuthStateService,
    private readonly environment: EnvironmentService,
    private readonly http: HttpClient,
  ) {}

  async canDeactivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      await this.provisionUser();
    } catch (e) {
      console.error('Provision User Failed', e);
    }
    return true;
  }

  async provisionUser(): Promise<any> {
    const accessToken = (await this.oktaAuthStateService['oktaAuth'].tokenManager.get('accessToken'))?.accessToken;
    const url = `${this.environment.amberBaseUrl}/api/bouncer/v2/user/provision`;

    const headers = new HttpHeaders({
      'skip-auth-interceptor': 'true',
      'X-Edx-Okta-Access-Token': accessToken,
    });

    return this.http.post<any>(url, {}, { headers }).toPromise();
  }
}
