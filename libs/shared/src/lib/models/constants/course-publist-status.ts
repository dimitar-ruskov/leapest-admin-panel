import {CoursePublishStatusModel} from "../interfaces";

export const COURSE_PUBLISH_STATUS: CoursePublishStatusModel[] =
[
    {
      label: 'Private',
      value: true,
      tooltip:
        'Viewing this SmartCard is restricted to users who you have shared it. Sharing a SmartCard can be done directly, or indirectly, via a Group, or Channel, that the users belong to.',
    },
    { label: 'Public', value: false, tooltip: 'Anyone can view this SmartCard.' },
];
