import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {IltEventAttendanceStatusHints, IltEventAttendanceStatusKeys} from "../../../../models/interfaces";
import {EnvironmentService} from "../../../../utils/services/common";

const ATTENDANCE_TRACKING_HELP_TEXT = "Manage and track your learners' attendance";

@Component({
  selector: 'leap-attendance-tracking-help',
  templateUrl: './attendance-tracking-help.component.html',
  styleUrls: ['./attendance-tracking-help.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingHelpComponent {
  @Input()
  set hasCustomReasons(hasCustomReasons) {
    this._hasCustomReasons = hasCustomReasons;
    if (hasCustomReasons) {
      this.statusIconHints.push({
        status: IltEventAttendanceStatusKeys.INFORMED,
        hint: IltEventAttendanceStatusHints.INFORMED,
      });
    }
  }

  get hasCustomReasons(): boolean {
    return this._hasCustomReasons;
  }

  helpText = ATTENDANCE_TRACKING_HELP_TEXT;
  statuses = IltEventAttendanceStatusKeys;
  statusIconHints = [
    {
      status: IltEventAttendanceStatusKeys.NOT_SPECIFIED,
      hint: IltEventAttendanceStatusHints.NOT_SPECIFIED,
    },
    {
      status: IltEventAttendanceStatusKeys.PRESENT,
      hint: IltEventAttendanceStatusHints.PRESENT,
    },
    {
      status: IltEventAttendanceStatusKeys.PARTIAL,
      hint: IltEventAttendanceStatusHints.PARTIAL,
    },
    {
      status: IltEventAttendanceStatusKeys.ABSENT,
      hint: IltEventAttendanceStatusHints.ABSENT,
    },
  ];

  private _hasCustomReasons: boolean;

  constructor(public readonly environmentService: EnvironmentService) {}
}
