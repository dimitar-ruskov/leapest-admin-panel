import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  TrackByFunction,
} from '@angular/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';

import {
  FixedTableColumn,
  FixedTableColumnsConfig,
} from '../../../../utils/directives/table-column-paginator/fixed-table-columns-config';
import { BulkCompleteAttendanceEvent } from '../../../../models/events/bulk-complete-attendance-event.model';
import { AttendanceTrackingReasonModalComponent } from '../attendance-tracking-reason-modal/attendance-tracking-reason-modal.component';
import {
  ILTEventAttendance,
  ILTEventAttendancesByUser,
  IltEventAttendanceStatusKey,
  IltEventAttendanceStatusKeys,
  IltEventAttendanceStatusValue,
  ILTEventCustomAttendanceLight,
  ILTEventLearner, IPageable
} from "../../../../models";
import {createPageableFromTableQueryParams, DeferredResource} from "../../../../utils/common";

const NO_LEARNERS_TEXT = 'There are no learners enrolled in this course event';
const CANNOT_MARK_AS_COMPLETED_TEXT =
  'To mark a course as completed, learners must have a daily attendance record for each day.';
const MARK_AS_COMPLETED_TEXT =
  'This will be reflected in the LXP, marking the associated smart card as 100% completed for this learner';
const fixedTableColumns: FixedTableColumn[] = [
  {
    name: 'checkbox',
    width: 40,
    measurement: 'px',
  },
  {
    name: 'name',
    width: 130,
    measurement: 'px',
  },
  {
    name: 'email',
    width: 130,
    measurement: 'px',
  },
  {
    name: 'leftPaginationButton',
    width: 50,
    measurement: 'px',
  },
  {
    name: 'rightPaginationButton',
    width: 50,
    measurement: 'px',
  },
  {
    name: 'action',
    width: 220,
    measurement: 'px',
  },
];

@Component({
  selector: 'leap-attendance-tracking-table',
  templateUrl: './attendance-tracking-table.component.html',
  styleUrls: ['./attendance-tracking-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingTableComponent {
  @Input() isAutomatic = false;
  @Input() set attendancesByUsers(
    attendancesByUsers: DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>,
  ) {
    if (attendancesByUsers) {
      const data = attendancesByUsers.response?.data ?? [];

      this.isPending = attendancesByUsers.isPending;
      this.data = data;
      this.days = getDaysFromILTEventAttendancesByUser(data);
      this.total = attendancesByUsers.response?.flags?.size ?? 0;
      this.refreshCheckedStatus();
    }
  }

  @Input() eventId: string;
  @Input() attendanceUpdating: boolean;
  @Input() customReasons: ILTEventCustomAttendanceLight[];
  @Input() queryParams: IPageable;

  @Output() attendanceChange = new EventEmitter<{
    statusKey: IltEventAttendanceStatusKey;
    attendanceEntry: ILTEventAttendance;
  }>();

  @Output() queryParamsChange: EventEmitter<IPageable> = new EventEmitter<IPageable>();
  @Output() eventAttendanceCompleted: EventEmitter<ILTEventLearner> = new EventEmitter<ILTEventLearner>();
  @Output() unmarkCompletion: EventEmitter<ILTEventLearner> = new EventEmitter<ILTEventLearner>();
  @Output() bulkComplete: EventEmitter<BulkCompleteAttendanceEvent> = new EventEmitter<BulkCompleteAttendanceEvent>();
  @Output() updateAttendance: EventEmitter<any> = new EventEmitter<any>();

  noResultsText = NO_LEARNERS_TEXT;
  markAsCompletedTooltip = MARK_AS_COMPLETED_TEXT;
  cannotMarkAsCompletedTooltip = CANNOT_MARK_AS_COMPLETED_TEXT;

  mainCheckboxChecked = false;
  mainCheckboxIndeterminate = false;
  mainCheckboxDisabled = false;
  setOfCheckedId = new Set<string>();

  paginatedColumnMinWidth = 90;
  tableColumnPaginatorStep = 1;
  fixedTableColumnsConfig = new FixedTableColumnsConfig(fixedTableColumns);

  nameSortOrder: NzTableSortOrder = null;
  emailSortOrder: NzTableSortOrder = null;

  isPending = true;
  data: ILTEventAttendancesByUser[] = [];
  total = 0;
  days: string[] = [];

  daysTrackByFn: TrackByFunction<string> = (index, item) => item;
  tableRowTrackByFn: TrackByFunction<ILTEventAttendancesByUser> = (index, item) => item.user.id;
  tableRowAttendanceColumnTrackByFn: TrackByFunction<ILTEventAttendance> = (index, item) => item.day;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly modalService: NzModalService,
    private readonly store: Store,
  ) {}

  isAvailable(date: string): boolean {
    return moment().isAfter(moment(date), !this.isAutomatic ? 'minutes' : 'days');
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable: IPageable = createPageableFromTableQueryParams(queryParams);

    this.queryParamsChange.emit(pageable);
  }

  completeInBulk(event: MouseEvent): void {
    event.stopPropagation();
    const selectedEligibleLearners = [];
    const selectedNotEligibleLearners = [];

    const selectedLearners = this.data
      .filter((attendanceByUser) => this.setOfCheckedId.has(attendanceByUser.user.username))
      .map((attendanceByUser) => attendanceByUser.user);

    this.data
      .filter((attendanceByUser) => this.setOfCheckedId.has(attendanceByUser.user.username))
      .map((attendanceByUser) =>
        attendanceByUser.completed
          ? selectedEligibleLearners.push(attendanceByUser)
          : selectedNotEligibleLearners.push(attendanceByUser),
      );

    this.bulkComplete.emit({
      days: this.days,
      selectedLearners,
      selectedEligibleLearnersCount: selectedEligibleLearners.length,
      selectedNotEligibleLearnersCount: selectedNotEligibleLearners.length,
      totalLearners: this.total,
    });
  }

  markEventAsCompleted(event: MouseEvent, user: ILTEventLearner): void {
    event.stopPropagation();
    this.eventAttendanceCompleted.emit(user);
  }

  onAttendanceStatusChange(statusKey: IltEventAttendanceStatusKey, attendanceEntry: ILTEventAttendance): void {
    this.attendanceChange.emit({ statusKey, attendanceEntry });
  }

  onResized(): void {
    this.cdr.markForCheck();
  }

  onAllChecked(checked: boolean): void {
    this.getDataListMap().enabled.forEach(({ user: { username } }) => this.updateCheckedSet(username, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(username: string, checked: boolean): void {
    this.updateCheckedSet(username, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(username: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(username);
    } else {
      this.setOfCheckedId.delete(username);
    }
  }

  refreshCheckedStatus(): void {
    const map = this.getDataListMap();
    const enabledRowsCount = map.enabled.length;

    map.disabled.forEach((attendancesByUser) => {
      const username = attendancesByUser.user.username;

      if (this.setOfCheckedId.has(username)) {
        this.setOfCheckedId.delete(username);
      }
    });

    this.mainCheckboxChecked = enabledRowsCount
      ? map.enabled.every(({ user: { username } }) => this.setOfCheckedId.has(username))
      : false;
    this.mainCheckboxIndeterminate =
      map.enabled.some(({ user: { username } }) => {
        return this.setOfCheckedId.has(username);
      }) && !this.mainCheckboxChecked;
    this.mainCheckboxDisabled = !enabledRowsCount;
  }

  openCustomAttendanceModal(attendanceEntry: ILTEventAttendance) {
    const modal = this.modalService.create({
      nzTitle: this.defineAttendanceStatus(attendanceEntry.attendance.configKey),
      nzContent: AttendanceTrackingReasonModalComponent,
      nzComponentParams: {
        attendanceStatus: this.defineAttendanceStatus(attendanceEntry.attendance.configKey),
        customAttendance: attendanceEntry.customAttendance?.customAttendanceName,
        reason: attendanceEntry.customAttendance?.reason,
        reasons: this.getCustomReasons(this.customReasons, attendanceEntry.attendance.configValue),
        learner: attendanceEntry.user.displayName,
        date: attendanceEntry.date,
      },
      nzWidth: '660px',
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: (_) => modal.destroy(),
        },
        {
          label: 'Save Reason',
          type: 'primary',
          disabled: (instance: AttendanceTrackingReasonModalComponent) => !instance.form.valid,
          onClick: async (instance: AttendanceTrackingReasonModalComponent) => {
            const form = instance.form.value;
            const data = {
              ...attendanceEntry,
              customAttendance: {
                ...form,
                status: attendanceEntry.attendance,
              },
            };

            this.updateAttendance.emit(({ eventId: this.eventId, data }));
            modal.destroy();
          },
        },
      ],
    });
  }

  onUnmarkCompletion(user: ILTEventLearner): void {
    this.unmarkCompletion.emit(user);
  }

  private getCustomReasons(
    reasons: ILTEventCustomAttendanceLight[],
    attendanceStatus: IltEventAttendanceStatusValue,
  ): ILTEventCustomAttendanceLight[] {
    return reasons
      .filter((reason: ILTEventCustomAttendanceLight) => reason.status === attendanceStatus)
      .sort((a, b) => (a.reasonMandatory ? 1 : -1));
  }

  private defineAttendanceStatus(attendanceStatus: IltEventAttendanceStatusKey): string {
    switch (attendanceStatus) {
      case IltEventAttendanceStatusKeys.PARTIAL:
        return 'Partial Attendance';
      case IltEventAttendanceStatusKeys.ABSENT:
        return 'Absence';
    }
  }

  private getDataListMap(): { enabled: ILTEventAttendancesByUser[]; disabled: ILTEventAttendancesByUser[] } {
    const map = {
      enabled: [],
      disabled: [],
    };

    this.data.forEach((attendancesByUser) => {
      map[attendancesByUser.user.completionPercentage < 100 ? 'enabled' : 'disabled'].push(attendancesByUser);
    });

    return map;
  }
}

function getDaysFromILTEventAttendancesByUser(attendancesByUsers: ILTEventAttendancesByUser[]): string[] {
  return attendancesByUsers && Array.isArray(attendancesByUsers) && attendancesByUsers.length
    ? attendancesByUsers[0].attendances.map((attendance: ILTEventAttendance) => attendance.date)
    : [];
}
