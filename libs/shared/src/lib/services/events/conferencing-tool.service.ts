import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DeferredResource } from "../../utils/common";
import { AdminPanelApiService } from "../common/admin-panel-api.service";

@Injectable({
  providedIn: 'root',
})
export class ConferencingToolService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService, private readonly http: HttpClient) {}

  authorizeZoom(code: string, redirect_uri: string): Observable<DeferredResource<boolean>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/authorize/zoom');
    const params = this.adminPanelApiService
      .prepareParams()
      .append('code', code)
      .append('redirectUri', redirect_uri);

    return this.adminPanelApiService.post(url, new HttpHeaders({}), {}, params);
  }

  checkIfUserIsInAccount(meetingType: string, username: string): Observable<{ data: boolean }> {
    const url =
      this.adminPanelApiService.prepareURL('/api/solar/partner/external-meetings/user/exists') +
      '?meetingType=' +
      meetingType +
      '&userName=' +
      encodeURIComponent(username);

    return this.http.get<{ data: boolean }>(url);
  }

  checkIfAccountIsPro(meetingType: string): Observable<{ data: boolean }> {
    const url =
      this.adminPanelApiService.prepareURL('/api/solar/partner/external-meetings/account/is-pro') +
      '?meetingType=' +
      meetingType;

    return this.http.get<{ data: boolean }>(url);
  }
}
