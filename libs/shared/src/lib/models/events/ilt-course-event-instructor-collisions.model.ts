export interface CourseEventInstructorCollisionPayload {
  dates: string[];
  eventId: string;
  instructors: string[];
}

export interface CourseEventCollidingCourse {
  displayName: string;
  endDate: string;
  startDate: string;
  venue: any;
  virtualVenue: boolean;
}

export interface CourseEventInstructorsCollision {
  collidingCourses: CourseEventCollidingCourse[];
  userDTO: any;
}
