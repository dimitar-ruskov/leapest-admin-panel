export const REGISTRATION_PERIOD_OPTIONS_MAP = new Map([
  [true, 'Registration closes 12 hours prior the start of the Course Event'],
  [false, 'Registration closes at a specified date'],
]);

export const REGISTRATION_APPROVAL_OPTIONS_MAP = new Map(
  [
    [false, 'Yes, a training manager must approve registrations'],
    [true, 'No, approval is not required']
  ]
);

export const COURSE_COMPLETION_OPTIONS_MAP = new Map(
  [
    [true, 'Automatically, when all materials and/or exams are marked as completed.'],
    [false, 'Manually, by the Training Manager'],
  ]
);

export const SELF_REGISTRATION_OPTIONS_MAP = new Map(
  [
    [true, 'Yes, learners can register themselves for this course'],
    [false, 'No, learners will be manually assigned by an admin or training manager']
  ]
);
