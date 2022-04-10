import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {ILTEventCustomAttendanceLight} from "../../../../models/interfaces";

@Component({
  selector: 'leap-attendance-tracking-reason-modal',
  templateUrl: './attendance-tracking-reason-modal.component.html',
  styleUrls: ['./attendance-tracking-reason-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class AttendanceTrackingReasonModalComponent implements OnInit {
  @Input() attendanceStatus: string;
  @Input() customAttendance: string;
  @Input() reason: string;
  @Input() reasons: ILTEventCustomAttendanceLight[];
  @Input() learner: string;
  @Input() date: string;

  form: FormGroup = this.fb.group({
    customAttendanceName: [],
    reason: [],
  });

  get customAttendanceControl(): FormControl {
    return this.form.get('customAttendanceName') as FormControl;
  }

  get reasonControl(): FormControl {
    return this.form.get('reason') as FormControl;
  }

  constructor(private readonly fb: FormBuilder, private readonly modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.reasonControl.setAsyncValidators(this.validateReason.bind(this));

    this.customAttendanceControl.valueChanges.pipe(untilDestroyed(this)).subscribe((_) => {
      this.reasonControl.markAsDirty();
      this.reasonControl.updateValueAndValidity();
    });

    this.form.patchValue({
      customAttendanceName: this.customAttendance || this.reasons?.[0]?.customAttendanceName,
      reason: this.reason || null,
    });
  }

  validateReason(control: AbstractControl) {
    if (!control.value && this.customAttendanceControl.value.startsWith('Informed')) {
      return of({ required: true });
    } else {
      return of(null);
    }
  }
}
