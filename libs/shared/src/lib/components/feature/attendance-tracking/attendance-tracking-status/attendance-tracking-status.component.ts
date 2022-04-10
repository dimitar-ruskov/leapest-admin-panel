import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';

import {
  ILTEventAttendance,
  IltEventAttendanceStatusKey, IltEventAttendanceStatusKeys, IltEventAttendanceStatusValue,
  IltEventAttendanceStatusValues
} from "../../../../models/interfaces";
import {EnvironmentService} from "../../../../utils/services/common";

interface ILTEventAttendanceStatusOption {
  value: IltEventAttendanceStatusKey;
  label: IltEventAttendanceStatusValue;
}
const CANNOT_MARK_ATTENDANCE_WARNING_TEXT = 'Cannot mark attendance before event date and time';

@Component({
  selector: 'leap-attendance-tracking-status',
  templateUrl: './attendance-tracking-status.component.html',
  styleUrls: ['./attendance-tracking-status.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingStatusComponent {
  @Input() isDisabled: boolean;
  @Input() hasCustomReasons: boolean;
  @Input() available: boolean;

  @Input()
  set attendanceEntry(attendanceEntry: ILTEventAttendance) {
    if (attendanceEntry) {
      this._attendance = attendanceEntry;

      this.currentValue = this._attendance.attendance
        ? this._attendance.attendance.configKey
        : IltEventAttendanceStatusKeys.NOT_SPECIFIED;
    }
  }

  get attendanceEntry(): ILTEventAttendance {
    return this._attendance;
  }

  @Output() statusChange = new EventEmitter<IltEventAttendanceStatusKey | null>();
  @Output() customAttendanceOpened = new EventEmitter<never>();

  cannotMarkAttendanceWarning = CANNOT_MARK_ATTENDANCE_WARNING_TEXT;
  statuses = IltEventAttendanceStatusKeys;
  currentValue: IltEventAttendanceStatusKey;
  _attendance: ILTEventAttendance;

  statusesList: ILTEventAttendanceStatusOption[] = [
    {
      value: IltEventAttendanceStatusKeys.NOT_SPECIFIED,
      label: IltEventAttendanceStatusValues.NOT_SPECIFIED,
    },
    {
      value: IltEventAttendanceStatusKeys.PRESENT,
      label: IltEventAttendanceStatusValues.PRESENT,
    },
    {
      value: IltEventAttendanceStatusKeys.PARTIAL,
      label: IltEventAttendanceStatusValues.PARTIAL,
    },
    {
      value: IltEventAttendanceStatusKeys.ABSENT,
      label: IltEventAttendanceStatusValues.ABSENT,
    },
  ];

  constructor(public readonly environmentService: EnvironmentService, private readonly cdr: ChangeDetectorRef) {}

  trackByFn: TrackByFunction<ILTEventAttendanceStatusOption> = (index, item) => item.value;

  onStatusChange(status: IltEventAttendanceStatusKey): void {
    this.statusChange.emit(status === IltEventAttendanceStatusKeys.NOT_SPECIFIED ? null : status);
    this.cdr.detectChanges();
  }

  openCustomAttendance(event: MouseEvent): void {
    event.stopPropagation();
    this.customAttendanceOpened.emit();
  }
}
