import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {EnvironmentService} from "./environment.service";
import {IProfile} from "../../../models/interfaces";

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private readonly http: HttpClient, private readonly environment: EnvironmentService) {}

  getLearnerProfile(): Observable<IProfile> {
    const url = `${this.environment.amberBaseUrl}/domain/api/solar/branded/profile`;
    return this.http.get<IProfile>(url);
  }
}
