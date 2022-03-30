import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'leap-edit-attendance-tracking-settings-modal',
  templateUrl: './edit-attendance-tracking-settings-modal.component.html',
  styleUrls: ['./edit-attendance-tracking-settings-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAttendanceTrackingSettingsModalComponent implements OnInit {
  @Input() automaticAttendanceCompletion: boolean;
  @Input() automaticAttendanceTracking: boolean;
  @Input() completionRate: number;
  attendanceTrackingOptions: { key: boolean; value: string; hint: string }[] = [
    {
      key: false,
      value: 'Manual',
      hint: 'The Event Manager will manually indicate attendance for each learner',
    },
    {
      key: true,
      value: 'Automatic',
      hint: `Attendance will be automatically classified based on the following scale: 0% = "Not Attended"; 1-75% = "Partially Attended"; ≥76% = "Attended".
        To receive this information, please make sure that your instructor "Ends" the zoom meeting. Simply closing the meeting window will not record the attendance tracking.`,
    },
  ];

  completionOptions: { key: boolean; value: string; hint: string }[] = [
    {
      key: false,
      value: 'Manual',
      hint: 'The Event Manager will manually indicate course completion for each learner.',
    },
    {
      key: true,
      value: 'Automatic',
      hint: 'Completion will be automatically registered based on your criteria.',
    },
  ];

  get completionControl(): FormControl {
    return this.form.get('completion') as FormControl;
  }

  get attendanceTrackingControl(): FormControl {
    return this.form.get('attendanceTracking') as FormControl;
  }

  form: FormGroup = this.fb.group({
    attendanceTracking: [],
    completion: [],
    completionPercent: [],
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({
      attendanceTracking: this.automaticAttendanceTracking,
      completion: this.automaticAttendanceCompletion,
      completionPercent: this.completionRate,
    });
  }
}
