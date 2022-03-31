import { Injectable } from '@angular/core';
import { AdminPanelApiService } from './admin-panel-api.service';
import { Observable } from 'rxjs';
import { DeferredResource } from '../../snatch/utils/deferred-resource';
import {
  CourseEventInstructorCollisionPayload,
  CourseEventInstructorsCollision,
} from '../models/ilt-course-event-instructor-collisions.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CourseEventInstructorsCollisionService {
  constructor(private readonly adminPanelApiService: AdminPanelApiService) {}

  checkForCollision(
    body: CourseEventInstructorCollisionPayload,
  ): Observable<DeferredResource<CourseEventInstructorsCollision[]>> {
    const url = this.adminPanelApiService.prepareURL('/api/solar/partner/course-event/instructors/collision');
    const params = this.adminPanelApiService.prepareParams();

    return this.adminPanelApiService.post(url, new HttpHeaders({}), body, params);
  }
}
