import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {CourseEventInstructorsCollision} from "../../../models/interfaces";

@Component({
  selector: 'leap-instructors-collisions-warnings',
  templateUrl: './instructors-collisions-warnings.component.html',
  styleUrls: ['./instructors-collisions-warnings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructorsCollisionsWarningsComponent {
  private filteredCollisions: CourseEventInstructorsCollision[];

  @Input()
  set instructorCollisions(instructorCollisions: CourseEventInstructorsCollision[]) {
    this.filteredCollisions = instructorCollisions.map((instructorCollision) => {
      const groupedByDate = {};

      instructorCollision.collidingCourses.forEach((collision) => {
        const startDate = collision.startDate;

        if (!groupedByDate[startDate]) {
          groupedByDate[startDate] = collision;
        }
      });

      const collidingCourses = [];

      for (const key in groupedByDate) {
        if (groupedByDate.hasOwnProperty(key)) {
          collidingCourses.push(groupedByDate[key]);
        }
      }

      return {...instructorCollision, collidingCourses};
    });
  }

  get instructorCollisions(): CourseEventInstructorsCollision[] {
    return this.filteredCollisions;
  }
}
