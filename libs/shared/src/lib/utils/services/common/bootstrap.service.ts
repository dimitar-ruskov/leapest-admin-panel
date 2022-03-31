import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AmberResponse } from '../../snatch/models/amber-response.model';
import { EnvironmentService } from '../../snatch/services/environment.service';
import { IDomainData } from 'src/app/shared/model/domain-data.model';

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
