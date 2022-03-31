import { Injectable } from '@angular/core';
import { AdminPanelApiService } from './admin-panel-api.service';
import { Observable } from 'rxjs';
import { FlattenedCourseDetails } from '../models/ilt-event.model';
import { DeferredResource } from '../../snatch/utils/deferred-resource';
import { GenerateThumbnailPayload, S3BucketData, UploadThumbnailPayload } from '../models/course-thumbnail.model';
import { HttpHeaders } from '@angular/common/http';

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
