import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import {AdminPanelApiService} from "./common";
import {
  FlattenedCourseDetails,
  GenerateThumbnailPayload,
  S3BucketData,
  UploadThumbnailPayload
} from "../../models/interfaces";
import {DeferredResource} from "../common";

@Injectable({
  providedIn: 'root',
})
export class CourseThumbnailService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  generateCourseThumbnail(body: GenerateThumbnailPayload): Observable<DeferredResource<string>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course/thumbnail/generate');

    return this.adminPanelApiService.post<string, { id: string }>(url, new HttpHeaders({}), body);
  }

  uploadCourseThumbnail(
    courseId: string,
    s3BucketData: S3BucketData,
  ): Observable<DeferredResource<FlattenedCourseDetails>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/course/thumbnail/upload');
    const body = {
      id: courseId,
      thumbnailKey: s3BucketData.key,
      thumbnailBucket: s3BucketData.bucket,
    };

    return this.adminPanelApiService.post<FlattenedCourseDetails, UploadThumbnailPayload>(
      url,
      new HttpHeaders({}),
      body,
    );
  }
}
