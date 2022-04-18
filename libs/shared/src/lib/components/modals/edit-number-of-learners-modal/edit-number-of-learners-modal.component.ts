import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { COURSE_WAITING_LIST_LIMIT } from "../../../models";

@Component({
  selector: 'leap-edit-number-of-learners-modal',
  templateUrl: './edit-number-of-learners-modal.component.html',
  styleUrls: ['./edit-number-of-learners-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditNumberOfLearnersModalComponent implements OnInit {

  limit = COURSE_WAITING_LIST_LIMIT;
  form: FormGroup = this.fb.group({
    minLearners: [0, Validators.required],
    maxLearners: [0, Validators.required]
  });

  @Input() minStudents: number;
  @Input() maxSeats: number;
  @Input() learnerCount: number;

  constructor(private readonly fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.form.patchValue({
      minLearners: this.minStudents,
      maxLearners: this.maxSeats,
    });
  }

  getMinValue(currentMinValue: number, learnerCount: number): number {
    return Math.max(currentMinValue, learnerCount);
  }
}
