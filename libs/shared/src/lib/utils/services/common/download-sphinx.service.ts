import { Injectable } from '@angular/core';
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DownloadSphinxService {

  constructor(
    private readonly environment: EnvironmentService,
    private readonly http: HttpClient
  ) { }

  getSphinxUrl(bucket: string, file: string): string {
    return this.environment.sphinxUrl + '/proxy/solar/jwt/' + bucket + '/' + file;
  }

  downloadPDF(url: string): Observable<Blob> {
    return this.http.get<Blob>(url, { responseType: 'blob' as 'json' });
  }
}
