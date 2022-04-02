import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import {AdminPanelApiService} from "../common";
import {DeferredResource} from "../../common";
import {CourseEventInstructorCollisionPayload, CourseEventInstructorsCollision} from "../../../models/interfaces";

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
