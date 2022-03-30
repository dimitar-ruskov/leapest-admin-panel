import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, TrackByFunction } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ILTCourseAgendaDay } from '../../../../models/ilt-course.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { Moment } from 'moment';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Select } from '@ngxs/store';
import { IGlobalStateModel } from '../../../../../shared/global-state.model';
import { Observable } from 'rxjs';
import { IKeyValuePair } from '../../../../../core/model/dictionary.model';

const CANCEL_BUTTON_TEXT = 'Cancel';
const SAVE_CHANGES_BUTTON_TEXT = 'Save Changes';

@Component({
  selector: 'leap-edit-agenda-date-time-modal',
  templateUrl: './edit-agenda-date-time-modal.component.html',
  styleUrls: ['./edit-agenda-date-time-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditAgendaDateTimeModalComponent implements OnInit, OnDestroy {
  @Input() isTimezoneEditable = false;
  @Input() dayIndex: number | null = null;
  @Input() agendaDays: ILTCourseAgendaDay[] = [];
  @Input() isHistorical: boolean;
  @Input() timezone: string;

  @Select((state: IGlobalStateModel) => state.core.dictionaries.timezones)
  timezonesDict$: Observable<IKeyValuePair[]>;

  dateTimeSelectionForm: FormGroup;
  dateConstraints: ((d: Date) => boolean)[] = [];
  timeConstraints: (() => number[])[] = [];

  cancelButtonTitle = CANCEL_BUTTON_TEXT;
  saveChangesButtonTitle = SAVE_CHANGES_BUTTON_TEXT;

  hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  get dateTimeSelectionDays(): FormArray {
    return this.dateTimeSelectionForm?.get('days') as FormArray;
  }

  get dateTimeSelectionTimezone(): FormControl {
    return this.dateTimeSelectionForm?.get('timezone') as FormControl;
  }

  get indexOfFirstEnabledGroup(): number {
    return this.dateTimeSelectionDays.controls.findIndex((control) => !control.disabled);
  }

  get timeInSelectedTimezone(): Moment {
    return moment(new Date().toLocaleString('en-US', { timeZone: this.dateTimeSelectionTimezone.value }));
  }

  trackByFn: TrackByFunction<FormControl> = (index: number) => index;

  constructor(private readonly fb: FormBuilder, private readonly ref: NzModalRef) {}

  ngOnInit(): void {
    this.dateTimeSelectionForm = this.buildDateTimeSelectionForm(this.agendaDays);
    this.createConstraints();
    this.checkForConstraints();

    this.dateTimeSelectionDays.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.createConstraints();
      this.checkForConstraints();
    });

    this.dateTimeSelectionTimezone.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.createConstraints();
      this.checkForConstraints();
    });
  }

  ngOnDestroy(): void {}

  private buildDateTimeSelectionForm(days: ILTCourseAgendaDay[]): FormGroup {
    return this.fb.group({
      days: this.createDaysFormArray(days),
      timezone: [this.timezone, Validators.required],
    });
  }

  private createDaysFormArray(days: ILTCourseAgendaDay[]): FormArray {
    return this.fb.array(days.map((day: ILTCourseAgendaDay) => this.createDayControlsGroup(day.startDateTime)));
  }

  private createDayControlsGroup(dateStr: string): FormGroup {
    const date = dateStr ? convertStringToDate(dateStr) : null;
    const currentDate = convertStringToDate();
    const disabled = date ? moment(date).isSameOrBefore(currentDate, 'minute') : false;

    return this.fb.group({
      date: [{ value: date, disabled }],
      time: [{ value: date || currentDate, disabled }],
    });
  }

  private createConstraints(): void {
    this.dateConstraints = this.createDateConstraints(
      this.dateTimeSelectionDays.getRawValue(),
      this.indexOfFirstEnabledGroup,
    );
    this.timeConstraints = this.createTimeConstraints(this.dateTimeSelectionDays.getRawValue());
  }

  private checkForConstraints(): void {
    if (this.isHistorical) {
      return;
    }
    this.dateTimeSelectionDays.controls.forEach((control: FormControl) => {
      // clear date & time field if selected date is yesterday for current timezone + gap for 1 hour
      if (
        moment(control.value.date).isBefore(
          this.timeInSelectedTimezone
            .add(1, 'hours')
            .add(30, 'minutes')
            .startOf('hour'),
          'day',
        )
      ) {
        control.patchValue({ date: null, time: null }, { emitEvent: false });
      } else if (
        // clear time field if selected date is today for current timezone
        moment(control.value.date).isSame(this.timeInSelectedTimezone, 'day') &&
        moment(control.value.time).hour() <= this.timeInSelectedTimezone.hour()
      ) {
        control.patchValue({ time: null }, { emitEvent: false });
      }
    });
  }

  private createTimeConstraints(dateTimeValues: { date: Date; time: Date }[]): (() => number[])[] {
    return dateTimeValues.map(({ date: comparedDay }) => {
      // Time Constraints should be applied only for current day
      let minConstraintsTime = null;
      if (moment(comparedDay).isSame(this.timeInSelectedTimezone, 'day')) {
        const currentHour = this.timeInSelectedTimezone.hour();
        minConstraintsTime = this.hours.filter((hour) => currentHour >= hour);
      }

      return () => minConstraintsTime;
    });
  }

  private createDateConstraints(
    dateTimeValues: { date: Date; time: Date }[],
    indexOfFirstEnabledGroup: number,
  ): ((d: Date) => boolean)[] {
    const lastIndex = dateTimeValues.length - 1;

    return dateTimeValues.map(({ date: comparedDay }, index: number) => {
      const minDate = this.getMinDate(dateTimeValues, index, indexOfFirstEnabledGroup);
      const maxDate = this.getMaxDate(dateTimeValues, index, lastIndex);

      const minConstraint = this.createMinConstraint(this.isHistorical ? null : minDate, index);
      const maxConstraint = this.createMaxConstraint(this.isHistorical ? minDate : maxDate);

      return (date: Date) => {
        const min = minConstraint(date);
        const max = maxConstraint(date);

        return min || max;
      };
    });
  }

  public getPage(i): string {
    let value = convertStringToDate().toISOString();
    let index = i === 0 ? 0 : i - 1;
    while (index > -1) {
      if (this.dateTimeSelectionDays.controls[index].value.date) {
        value = this.dateTimeSelectionDays.controls[index].value.date;
        break;
      }
      index--;
    }

    return value;
  }

  private createMinConstraint(minDate: Date, index?: number): (d: Date) => boolean {
    if (index) {
      return (date: Date) => moment(date).isSameOrBefore(moment(minDate), 'day');
    } else {
      // Allow first event on current day
      return (date: Date) => moment(date).isBefore(moment(minDate), 'day');
    }
  }

  private getMinDate(
    dateTimeValues: { date: Date; time: Date }[],
    index: number,
    indexOfFirstEnabledGroup: number,
  ): Date {
    const isDisabled = index < indexOfFirstEnabledGroup;
    const isFirstEnabled = index === indexOfFirstEnabledGroup;

    if (isDisabled || isFirstEnabled) {
      // gap for 1 hour
      return this.timeInSelectedTimezone
        .add(1, 'hours')
        .add(30, 'minutes')
        .startOf('hour')
        .toDate();
    } else {
      let previousIndex = index - 1;
      while (previousIndex > 0) {
        if (dateTimeValues[previousIndex].date) {
          break;
        }
        previousIndex--;
      }

      previousIndex = previousIndex >= 0 ? previousIndex : 0;

      return dateTimeValues[previousIndex].date;
    }
  }

  private createMaxConstraint(maxDate: Date): (d: Date) => boolean {
    return maxDate ? (date: Date) => moment(date).isSameOrAfter(moment(maxDate), 'day') : (date: Date) => false;
  }

  private getMaxDate(dateTimeValues: { date: Date; time: Date }[], index: number, lastIndex: number): Date {
    if (index === lastIndex) {
      return null;
    } else {
      const nextIndex = index + 1;

      return dateTimeValues[nextIndex].date;
    }
  }

  closeModal(event: MouseEvent): void {
    event.stopPropagation();
    this.ref.close();
  }

  saveBulkDateTimeSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.ref.close({
      days: this.dateTimeSelectionDays.getRawValue(),
      timezone: this.dateTimeSelectionTimezone.value,
    });
  }
}

function convertStringToDate(dateStr?: string | undefined): Date {
  const rounded = moment()
    .startOf('hour')
    .add(1, 'hours')
    .toDate();
  return dateStr ? new Date(dateStr) : rounded;
}
