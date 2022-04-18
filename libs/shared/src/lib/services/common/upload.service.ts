import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import {EnvironmentService} from "./environment.service";
import {AmberResponse} from "../../models";

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private readonly http: HttpClient, private readonly envService: EnvironmentService) {}

  private getPresignedUrl(file: File, bucket: string, useFilename?: boolean, userDomain?: string): Observable<any> {
    const url = this.envService.saharaUrl + '/api/file/generate-presigned-url';
    const parts = file.name.split('.');
    const ext = parts[parts.length - 1];
    parts.pop();
    let filename = parts.join('.');

    let params = new HttpParams({})
      .set('bucket', bucket)
      .set('ext', ext)
      .set('contenttype', file.type);
    if (userDomain) {
      filename = `${userDomain}/${filename}`;
    }

    if (useFilename) {
      params = params.set('filename', filename);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<AmberResponse<any>>(url, { params: params, headers: headers });
  }

  uploadContent(file: File, bucket: string, presignedS3Url: string, userDomain?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });

    const req = new HttpRequest('PUT', presignedS3Url, file, {
      headers: headers,
      reportProgress: true, //This is required for track upload process
    });
    return this.http.request(req);
  }

  upload(file: File, bucket: string, useFilename?: boolean, userDomain?: string): Observable<any> {
    let s3Key;
    return this.getPresignedUrl(file, bucket, useFilename, userDomain).pipe(
      switchMap(({ url, key }) => {
        s3Key = key;
        return this.uploadContent(file, bucket, url);
      }),
      map((_) => {
        const result = <{ type: string; progress: number; bucket: string; key: string }>{};
        result.bucket = bucket;
        result.key = s3Key;
        switch (_.type) {
          case 0:
            result.type = 'started';
            break;
          case 1:
            result.type = 'progress';
            result.progress = (_.loaded / _.total) * 100;
            break;
          case 4:
            result.type = 'success';
            break;
        }
        return result;
      }),
    );
  }
}
