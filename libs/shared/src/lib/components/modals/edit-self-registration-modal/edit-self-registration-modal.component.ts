import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import {IKeyValuePair} from "../../../models/interfaces";
import {
  REGISTRATION_APPROVAL_OPTIONS_MAP,
  REGISTRATION_PERIOD_OPTIONS_MAP, SELF_REGISTRATION_OPTIONS_MAP
} from "../../../models/constants/registration-options";
import {getOptionsFromMap} from "../../../utils/common";

@Component({
  selector: 'leap-edit-self-registration-modal',
  templateUrl: './edit-self-registration-modal.component.html',
  styleUrls: ['./edit-self-registration-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditSelfRegistrationModalComponent implements OnInit {
  selfRegistrationOptions: IKeyValuePair[] = [];
  registrationPeriodOptions: IKeyValuePair[] = [];
  registrationApprovalOptions: IKeyValuePair[] = [];

  form: FormGroup = this.fb.group({
    selfRegistration: [true, Validators.required],
    automaticApproval: [true, Validators.required],
  });

  get selfRegistrationControl(): FormControl {
    return this.form.get('selfRegistration') as FormControl;
  }

  get automaticApprovalControl(): FormControl {
    return this.form.get('automaticApproval') as FormControl;
  }

  @Input() isSelfRegistrationEditable = true;
  @Input() selfRegistration: boolean;
  @Input() automaticApproval: boolean;

  @Input() withRegistrationPeriod = false;
  @Input() registrationDeadlineDependsOnEventStartDate?: boolean;
  @Input() registrationDeadline?: string;

  get registrationDeadlineDependsOnEventStartDateControl(): FormControl {
    return this.form.get('registrationPeriod')?.get('registrationDeadlineDependsOnEventStartDate') as FormControl;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.selfRegistrationOptions = getOptionsFromMap(SELF_REGISTRATION_OPTIONS_MAP);
    this.registrationApprovalOptions = getOptionsFromMap(REGISTRATION_APPROVAL_OPTIONS_MAP);
    this.registrationPeriodOptions = getOptionsFromMap(REGISTRATION_PERIOD_OPTIONS_MAP);

    this.form.patchValue({
      selfRegistration: this.selfRegistration,
      automaticApproval: this.automaticApproval,
    });

    if (this.withRegistrationPeriod) {
      this.initRegistrationPeriod();
    }

    this.subscribeToSelfRegistration();
  }

  private initRegistrationPeriod(): void {
    const eventTime = new Date();

    eventTime.setHours(12);
    eventTime.setMinutes(0);
    eventTime.setSeconds(0);

    this.form.addControl(
      'registrationPeriod',
      this.fb.group({
        registrationDeadlineDependsOnEventStartDate: [
          this.registrationDeadlineDependsOnEventStartDate,
          [Validators.required],
        ],
        registrationPeriodEndDate: [this.registrationDeadline ? new Date(this.registrationDeadline) : new Date()],
        registrationPeriodEndTime: [this.registrationDeadline ? new Date(this.registrationDeadline) : eventTime],
      }),
    );

    const registrationPeriodGroup = this.form.get('registrationPeriod') as FormGroup;
    const registrationPeriodEndDateControl = registrationPeriodGroup.get('registrationPeriodEndDate') as FormGroup;
    const registrationPeriodEndTimeControl = registrationPeriodGroup.get('registrationPeriodEndTime') as FormGroup;

    registrationPeriodGroup
      .get('registrationDeadlineDependsOnEventStartDate')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((depends: boolean) => {
        if (depends) {
          registrationPeriodEndDateControl.clearValidators();
          registrationPeriodEndTimeControl.clearValidators();
        } else {
          registrationPeriodEndDateControl.setValidators([Validators.required]);
          registrationPeriodEndTimeControl.setValidators([Validators.required]);
        }
      });
  }

  private subscribeToSelfRegistration(): void {
    this.selfRegistrationControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((isSelfRegistrationEnabled: boolean) => {
        if (!isSelfRegistrationEnabled) {
          this.automaticApprovalControl.reset(true);
        }
      });
  }
}
