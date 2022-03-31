import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IKeyValuePair } from '../../../../core/model/dictionary.model';
import {
  BulkAttendanceTrackingCompletionTypeKeys,
  BulkAttendanceTrackingCompletionTypeKey,
  IltEventAttendanceStatusKeys,
  IltEventAttendanceStatusValues,
} from '../../../models/ilt-event-attendance.model';
import * as moment from 'moment';
import { NzCheckBoxOptionInterface } from 'ng-zorro-antd/checkbox';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AdminCoursesService } from '../../../utils/services/admin-courses.service';
import { take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'leap-bulk-attendance-tracking-selection-modal',
  templateUrl: './bulk-attendance-tracking-selection-modal.component.html',
  styleUrls: ['./bulk-attendance-tracking-selection-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class BulkAttendanceTrackingSelectionModalComponent implements OnInit, OnDestroy {
  completionTypes = BulkAttendanceTrackingCompletionTypeKeys;
  completionTypeOptions: IKeyValuePair[] = [
    { key: BulkAttendanceTrackingCompletionTypeKeys.COURSE_COMPLETION, value: 'Course Completion' },
    { key: BulkAttendanceTrackingCompletionTypeKeys.DAILY_ATTENDANCE, value: 'Daily Attendance' },
  ];

  attendanceRecordOptions: IKeyValuePair[] = [
    { key: IltEventAttendanceStatusKeys.PRESENT, value: IltEventAttendanceStatusValues.PRESENT },
    { key: IltEventAttendanceStatusKeys.PARTIAL, value: IltEventAttendanceStatusValues.PARTIAL },
    { key: IltEventAttendanceStatusKeys.ABSENT, value: IltEventAttendanceStatusValues.ABSENT },
  ];

  daysOptions: NzCheckBoxOptionInterface[] = [];

  isValidatingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isValidating$(): Observable<boolean> {
    return this.isValidatingSubject.asObservable();
  }

  errorVisible = false;
  allLearnersEligible = true;
  form: FormGroup = this.fb.group({
    completionType: [BulkAttendanceTrackingCompletionTypeKeys.COURSE_COMPLETION, Validators.required],
    dailyAttendance: this.fb.group({
      attendanceDays: [],
      attendanceRecord: [null],
      markAttendanceForAllLearnersWithoutStatus: [false],
      markAttendanceForAllLearners: [false],
    }),
    markCompletionForAllEligibleLearners: [false, Validators.requiredTrue],
  });

  get completionTypeControl(): FormControl {
    return this.form.get('completionType') as FormControl;
  }

  get dailyAttendanceGroup(): FormGroup {
    return this.form.get('dailyAttendance') as FormGroup;
  }

  get attendanceDaysControl(): FormControl {
    return this.dailyAttendanceGroup.get('attendanceDays') as FormControl;
  }

  get attendanceRecordControl(): FormControl {
    return this.dailyAttendanceGroup.get('attendanceRecord') as FormControl;
  }

  get markAttendanceForAllLearnersWithoutStatusControl(): FormControl {
    return this.dailyAttendanceGroup.get('markAttendanceForAllLearnersWithoutStatus') as FormControl;
  }

  get markAttendanceForAllLearnersControl(): FormControl {
    return this.dailyAttendanceGroup.get('markAttendanceForAllLearners') as FormControl;
  }

  get markCompletionForAllEligibleLearnersControl(): FormControl {
    return this.form.get('markCompletionForAllEligibleLearners') as FormControl;
  }

  @Input() courseEventId: string;
  @Input() days: string[] = [];
  @Input() totalLearners = 0;
  @Input() selectedEligibleLearnersCount: number;
  @Input() selectedNotEligibleLearnersCount: number;
  @Input() selectedLearnersUsernames: string[] = [];
  @Input() areLearnersEligibleToComplete: boolean;

  keyValueTrackByFn: TrackByFunction<IKeyValuePair> = (index, item) => item.key;
  checkBoxOptionTrackByFn: TrackByFunction<NzCheckBoxOptionInterface> = (index, item) => item.value;

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    this.validateCompletion(this.courseEventId, this.selectedLearnersUsernames);
    this.prepareDaysOptions();
    this.initFormSubscriptions();
  }

  ngOnDestroy(): void {}

  public getError(learnersNumber: number): string {
    return (
      `You have selected ${learnersNumber} learners that are not yet eligible for Course Completion. ` +
      'If you wish to make them eligible, please mark their Daily Attendance records for each day of the event.'
    );
  }

  onSelectedAttendanceDaysChange(attendanceDays: string[]): void {
    this.attendanceDaysControl.patchValue(attendanceDays, { emitEvent: true });
  }

  private prepareDaysOptions(): void {
    this.daysOptions = this.days.map((day, index) => {
      const hasNotStarted = moment(day).isAfter(moment());

      return {
        label: `Day ${index + 1} - ${moment(day).format('DD MMM YYYY, HH:mm')}`,
        value: day,
        disabled: hasNotStarted,
      };
    });
  }

  private initFormSubscriptions() {
    this.completionTypeControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: BulkAttendanceTrackingCompletionTypeKey) => {
        switch (value) {
          case BulkAttendanceTrackingCompletionTypeKeys.COURSE_COMPLETION:
            this.dailyAttendanceGroup.reset({
              attendanceDay: [],
              attendanceRecord: null,
              markAttendanceForAllLearnersWithoutStatus: false,
              markAttendanceForAllLearners: false,
            });
            this.setDayAndRecordValidators(false);
            this.setAllEligibleLearnersCompletionValidator(!this.allLearnersEligible);
            break;
          case BulkAttendanceTrackingCompletionTypeKeys.DAILY_ATTENDANCE:
            this.markCompletionForAllEligibleLearnersControl.reset(false);
            this.setDayAndRecordValidators(true);
            this.setAllEligibleLearnersCompletionValidator(false);
            break;
        }
      });

    this.markAttendanceForAllLearnersWithoutStatusControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((checked: boolean) => {
        if (checked) {
          this.markAttendanceForAllLearnersControl.reset(false);
        }
      });

    this.markAttendanceForAllLearnersControl.valueChanges.pipe(untilDestroyed(this)).subscribe((checked: boolean) => {
      if (checked) {
        this.markAttendanceForAllLearnersWithoutStatusControl.reset(false);
      }
    });
  }

  private setDayAndRecordValidators(isRequired: boolean): void {
    if (isRequired) {
      this.attendanceDaysControl.setValidators(Validators.required);
      this.attendanceRecordControl.setValidators(Validators.required);
    } else {
      this.attendanceDaysControl.clearValidators();
      this.attendanceRecordControl.clearValidators();
    }

    this.attendanceDaysControl.updateValueAndValidity();
    this.attendanceRecordControl.updateValueAndValidity();
  }

  private setAllEligibleLearnersCompletionValidator(isRequired: boolean): void {
    if (isRequired) {
      this.markCompletionForAllEligibleLearnersControl.setValidators(Validators.requiredTrue);
    } else {
      this.markCompletionForAllEligibleLearnersControl.clearValidators();
    }

    this.markCompletionForAllEligibleLearnersControl.updateValueAndValidity();
  }

  private validateCompletion(courseEventId: string, selectedLearnersUsernames: string[]): void {
    const selectedLearnersCount = selectedLearnersUsernames.length;

    this.isValidatingSubject.next(true);
    this.adminCoursesService
      .validateBulkILTEventAttendanceCompletion(courseEventId, selectedLearnersUsernames, false)
      .pipe(take(1))
      .subscribe(
        (notEligibleLearners: string[]) => {
          if (notEligibleLearners && Array.isArray(notEligibleLearners)) {
            const notEligibleLearnersCount = notEligibleLearners.length;

            if (notEligibleLearnersCount > 0) {
              this.errorVisible = true;
              this.allLearnersEligible = false;
              this.setAllEligibleLearnersCompletionValidator(!this.allLearnersEligible);

              if (notEligibleLearnersCount === selectedLearnersCount) {
                this.errorVisible = true;
                this.completionTypeControl.patchValue(BulkAttendanceTrackingCompletionTypeKeys.DAILY_ATTENDANCE, {
                  emitEvent: true,
                });
                this.completionTypeControl.disable();
              }
            } else {
              this.errorVisible = false;
              this.allLearnersEligible = true;
              this.setAllEligibleLearnersCompletionValidator(!this.allLearnersEligible);
            }
          }

          this.isValidatingSubject.next(false);
        },
        () => this.isValidatingSubject.next(false),
      );
  }
}
