import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from 'src/app/snatch/services';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MiscService {
  constructor(private readonly http: HttpClient, private readonly environment: EnvironmentService) {}

  getLearnerProfile(): Observable<any> {
    const url = `${this.environment.amberBaseUrl}/domain/api/solar/branded/profile`;
    return this.http.get<any>(url);
  }
}
