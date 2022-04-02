import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {EnvironmentService} from "./environment.service";
import {AmberResponse, IDomainData} from "../../../models/interfaces";

@Injectable({
  providedIn: 'root',
})
export class BootstrapService {
  constructor(private readonly http: HttpClient, private readonly environment: EnvironmentService) {}

  getDomainData(domain: string): Observable<AmberResponse<IDomainData>> {
    const url = `${this.environment.amberBaseUrl}/api/solar/public/domain`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'xitpx-domain': domain,
      'skip-auth-interceptor': 'true',
    });

    return this.http.get<AmberResponse<IDomainData>>(url, { headers });
  }
}
