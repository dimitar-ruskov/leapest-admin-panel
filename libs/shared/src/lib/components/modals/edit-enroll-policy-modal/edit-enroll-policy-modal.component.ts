import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {EnrollmentPolicyKeys} from "../../../models";

@Component({
  selector: 'leap-edit-enroll-policy-modal',
  templateUrl: './edit-enroll-policy-modal.component.html',
  styleUrls: ['./edit-enroll-policy-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditEnrollPolicyModalComponent implements OnInit {
  form: FormGroup;
  showMessage: boolean;
  enrollmentPolicyKeys = EnrollmentPolicyKeys;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      enrollmentPolicy: [null, Validators.required],
    });

    this.form.controls.enrollmentPolicy.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => (this.showMessage = value === this.enrollmentPolicyKeys.MULTIPLE));
  }
}
