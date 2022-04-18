import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {AmberResponse, IKeyValuePair} from "../../models";
import {EnvironmentService} from "../common";

@Injectable({
  providedIn: 'root',
})
export class LxpUsersService {
  constructor(
    private readonly environment: EnvironmentService,
    private readonly http: HttpClient
  ) {}

  getLxpUsers(filter: string): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/lxp/users/list`;

    let params = new HttpParams();
    params = params.append('filter', filter.toString());
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  getLxpUsersByGroupId(groupId: string): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/lxp/users/group/members/list`;

    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  getLxpGroups(filter?: string): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/lxp/users/groups/list`;

    let params = new HttpParams();
    if (filter) {
      params = params.append('filter', filter);
    }
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }

  getLxpChannels(filter?: string): Observable<IKeyValuePair[]> {
    const url = `${this.environment.amberBaseUrl}/api/agora/lxp-product/channels`;

    let params = new HttpParams();
    if (filter) {
      params = params.append('filter', filter);
    }
    return this.http
      .get<AmberResponse<IKeyValuePair[]>>(url, { params })
      .pipe(map((t) => t.data));
  }
}
