import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';

import {IltEventAttendanceStatusKey, IltEventAttendanceStatusKeys} from "../../../../models";
import {EnvironmentService} from "../../../../services/common";

@Component({
  selector: 'leap-attendance-tracking-status-icon',
  templateUrl: './attendance-tracking-status-icon.component.html',
  styleUrls: ['./attendance-tracking-status-icon.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingStatusIconComponent {
  @HostBinding('class')
  @Input()
  status: IltEventAttendanceStatusKey;

  constructor(public readonly environmentService: EnvironmentService) {}

  statuses = IltEventAttendanceStatusKeys;
  statusIconsMap: { [key: string]: string } = {
    [IltEventAttendanceStatusKeys.NOT_SPECIFIED]: 'question-circle',
    [IltEventAttendanceStatusKeys.PRESENT]: 'user-clock',
    [IltEventAttendanceStatusKeys.PARTIAL]: 'user-clock',
  };
}
