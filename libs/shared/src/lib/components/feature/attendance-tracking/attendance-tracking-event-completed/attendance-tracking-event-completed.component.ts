import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';


const COMPLETED_EVENT_ATTENDANCES_STATUS = 'Completed';

@Component({
  selector: 'leap-attendance-tracking-event-completed',
  template: '<i class="fal fa-check"></i><span>{{ status }}</span>',
  styleUrls: ['./attendance-tracking-event-completed.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceTrackingEventCompletedComponent {
  @HostBinding('attr.title') status = COMPLETED_EVENT_ATTENDANCES_STATUS;
}
