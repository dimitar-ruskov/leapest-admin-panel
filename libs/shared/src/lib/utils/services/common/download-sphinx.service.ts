import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/app/snatch/services';


@Injectable({
  providedIn: 'root'
})
export class DownloadSphinxService {

  constructor(
    private environment: EnvironmentService
  ) { }

  getSphinxUrl(bucket: string, file: string): string {
    return this.environment.sphinxUrl + '/proxy/solar/jwt/' + bucket + '/' + file;
  }
}
