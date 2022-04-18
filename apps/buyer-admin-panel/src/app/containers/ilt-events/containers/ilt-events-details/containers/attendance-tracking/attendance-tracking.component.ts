import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { filter, withLatestFrom } from "rxjs/operators";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { IltEventDetailsState } from "../../state/ilt-event-details.state";
import {
  BulkCompleteILTEventAttendances,
  BulkMarkILTEventAttendances,
  ChangeILTEventAttendancesFilter,
  ChangeILTEventAttendancesPage,
  ChangeILTEventAttendancesSort,
  CompleteILTEventAttendance,
  GetILTEventAttendancesByUsers,
  UnmarkCompletion,
  UpdateILTEventAttendance
} from "../../state/ilt-event-details.actions";
import {
  AttendanceTrackingService
} from "../../../../../../../../../../libs/shared/src/lib/services/events/attendance-tracking.service";
import {
  AttendanceTrackingUnmarkCompletionModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/feature/attendance-tracking/attendance-tracking-unmark-completion-modal/attendance-tracking-unmark-completion-modal.component";

import {
  BulkAttendanceTrackingCompletionTypeKeys,
  BulkCompleteAttendanceEvent,
  ILTEvent,
  ILTEventAttendance,
  ILTEventAttendanceCompletionPayload,
  ILTEventAttendanceCompletionPayloadAttendance,
  ILTEventAttendancesByUser,
  IltEventAttendanceStatusKey,
  ILTEventAttendanceUpdatePayload,
  ILTEventBulkMarkAttendancesPayload,
  ILTEventCustomAttendanceLight,
  ILTEventLearner,
  IPageable
} from "../../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import { IGlobalStateModel } from "../../../../../../state/state.model";
import {
  BulkAttendanceTrackingSelectionModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/bulk-attendance-tracking-selection-modal/bulk-attendance-tracking-selection-modal.component";

@Component({
  selector: 'leap-attendance-tracking',
  templateUrl: './attendance-tracking.component.html',
  styleUrls: ['./attendance-tracking.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class AttendanceTrackingComponent implements OnInit {
  @Input() event: ILTEvent;

  @Select(IltEventDetailsState.paginationILTEventAttendanceTracking)
  queryParams$: Observable<IPageable>;

  @Select(IltEventDetailsState.iltEventAttendancesByUsers)
  attendancesByUsers$: Observable<DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>>;

  @Select(IltEventDetailsState.iltEventAttendanceUpdating)
  attendanceUpdating$: Observable<boolean>;

  @Select((state: IGlobalStateModel) => state.core.customAttendanceDictionary)
  customAttendanceDictionary$: Observable<ILTEventCustomAttendanceLight[]>;

  private readonly queryParamsChangeSubject: Subject<IPageable> = new Subject<IPageable>();
  customReasons: ILTEventCustomAttendanceLight[];

  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly attendanceService: AttendanceTrackingService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.queryParamsChangeSubject
      .asObservable()
      .pipe(
        withLatestFrom(this.queryParams$),
        filter(([change, current]) => {
          return change.page !== current.page || change.sort !== current.sort;
        }),
        untilDestroyed(this),
      )
      .subscribe(([change]) => {
        this.store.dispatch([
          new ChangeILTEventAttendancesPage(change.page),
          new ChangeILTEventAttendancesSort(change.sort),

          new GetILTEventAttendancesByUsers(this.event.sku),
        ]);
      });

    this.customAttendanceDictionary$
      .pipe(untilDestroyed(this))
      .subscribe((reasons: ILTEventCustomAttendanceLight[]) => {
        this.customReasons = reasons;
        this.cdr.detectChanges();
      });
  }

  onSearch(searchValue: string): void {
    this.store.dispatch([
      new ChangeILTEventAttendancesPage(1),
      new ChangeILTEventAttendancesFilter(searchValue),
      new GetILTEventAttendancesByUsers(this.event.sku),
    ]);
  }

  onAttendanceChange({
    statusKey,
    attendanceEntry,
  }: {
    statusKey: IltEventAttendanceStatusKey;
    attendanceEntry: ILTEventAttendance;
  }) {
    const { user, classEventId, agendaItemId, day } = attendanceEntry;
    const { id, username, firstName, lastName } = user;
    const data: ILTEventAttendanceUpdatePayload = {
      attendance: { configKey: statusKey, configType: 'learner-attendance-type' },
      user: {
        id,
        username,
        firstName,
        lastName,
      },
      classEventId,
      agendaItemId,
      day,
    };

    this.store.dispatch(new UpdateILTEventAttendance({ eventId: this.event.id, data }));
  }

  onQueryParamsChange(pageable: IPageable): void {
    this.queryParamsChangeSubject.next(pageable);
  }

  onEventAttendanceCompleted(user: ILTEventLearner): void {
    const data = this.getCompletionPayload(user.username, 100);

    this.store.dispatch(new CompleteILTEventAttendance({ eventId: this.event.id, data }));
  }

  updateAttendance(payload: {eventId: string; data: ILTEventAttendanceUpdatePayload;}): void {
    this.store.dispatch(new UpdateILTEventAttendance(payload));
  }

  unmarkCompletion(user: ILTEventLearner): void {
    const modal = this.modalService.create({
      nzTitle: 'Unmark Event Completion?',
      nzContent: AttendanceTrackingUnmarkCompletionModalComponent,
      nzComponentParams: { user },
      nzCancelText: 'Cancel',
      nzOkText: 'Unmark Completion',
      nzOkDanger: true,
      nzWidth: '660px',
      nzOnOk: () => {
        const data = this.getCompletionPayload(user.username, 0);

        this.store
          .dispatch(new UnmarkCompletion({ eventId: this.event.id, data }))
          .toPromise()
          .then((_) => {
            modal.destroy();
          });
      },
    });
  }

  onBulkCompleteAttendances({
    days,
    selectedLearners,
    totalLearners,
    selectedEligibleLearnersCount,
    selectedNotEligibleLearnersCount,
  }: BulkCompleteAttendanceEvent): void {
    const courseEventId = this.event.id;
    const classEventId = this.event.classEvent.id;
    const selectedLearnersUsernames = selectedLearners.map((learner) => learner.username);

    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Mark completion',
      nzContent: BulkAttendanceTrackingSelectionModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        courseEventId,
        days,
        totalLearners,
        selectedLearnersUsernames,
        selectedEligibleLearnersCount,
        selectedNotEligibleLearnersCount,
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => {
            modal.destroy();
          },
        },
        {
          label: 'Save',
          type: 'primary',
          disabled: (contentComponentInstance) => contentComponentInstance.form.invalid,
          onClick: (contentComponentInstance: BulkAttendanceTrackingSelectionModalComponent) => {
            const formValue = contentComponentInstance.form.getRawValue();

            if (formValue.completionType === BulkAttendanceTrackingCompletionTypeKeys.COURSE_COMPLETION) {
              if (formValue.markCompletionForAllEligibleLearners) {
                const data = {
                  completionPercentage: 100,
                };

                return this.store.dispatch(new BulkCompleteILTEventAttendances({ eventId: courseEventId, data }));
              } else {
                const attendances: ILTEventAttendanceCompletionPayloadAttendance[] = selectedLearnersUsernames.map(
                  (username) => ({
                    learner: { username },
                    completionPercentage: 100,
                  }),
                );
                const data = {
                  attendances,
                  completionPercentage: 100,
                  allUsers: false,
                };

                return this.store
                  .dispatch(new BulkCompleteILTEventAttendances({ eventId: courseEventId, data }))
                  .toPromise()
                  .then(() => {
                    modal.destroy();
                  });
              }
            } else if (formValue.completionType === BulkAttendanceTrackingCompletionTypeKeys.DAILY_ATTENDANCE) {
              const selectedDays = formValue.dailyAttendance.attendanceDays || [];
              const selectedDaysIndexes = selectedDays.map((day: string) => days.indexOf(day));
              const allUsers = formValue.dailyAttendance.markAttendanceForAllLearners;
              const onlyEmptyAttendance = formValue.dailyAttendance.markAttendanceForAllLearnersWithoutStatus;

              const data: ILTEventBulkMarkAttendancesPayload = {
                attendance: {
                  configKey: formValue.dailyAttendance.attendanceRecord as IltEventAttendanceStatusKey,
                  configType: 'learner-attendance-type',
                },
                classEventId,
                users: selectedLearnersUsernames,
                days: selectedDaysIndexes,
                allUsers: allUsers || onlyEmptyAttendance,
                onlyEmptyAttendance,
              };

              return this.store
                .dispatch(new BulkMarkILTEventAttendances({ eventId: courseEventId, data }))
                .toPromise()
                .then(() => {
                  modal.destroy();
                  this.store.dispatch(new GetILTEventAttendancesByUsers(this.event.sku));
                });
            }
          },
        },
      ],
    });
  }

  private getCompletionPayload(username: string, completionPercentage: number): ILTEventAttendanceCompletionPayload {
    return {
      attendances: [
        {
          learner: { username },
          completionPercentage,
        },
      ],
      completionPercentage,
      allUsers: false,
    };
  }
}
