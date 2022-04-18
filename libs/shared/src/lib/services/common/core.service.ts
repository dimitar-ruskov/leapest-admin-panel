import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {EnvironmentService} from "./environment.service";
import {AmberResponse, IProfile} from "../../models";

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private readonly http: HttpClient, private readonly environment: EnvironmentService) {}

  getLearnerProfile(): Observable<AmberResponse<IProfile>> {
    const url = `${this.environment.amberBaseUrl}/domain/api/solar/branded/profile`;
    return this.http.get<AmberResponse<IProfile>>(url);
  }
}
