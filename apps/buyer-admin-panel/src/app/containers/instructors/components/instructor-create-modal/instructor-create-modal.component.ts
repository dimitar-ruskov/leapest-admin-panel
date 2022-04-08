import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstructorLite } from '../../../../../../../../libs/shared/src/lib/models/interfaces/instructors/instructor.model';

@Component({
  selector: 'leap-instructor-create-modal',
  templateUrl: './instructor-create-modal.component.html',
  styleUrls: ['./instructor-create-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorCreateModalComponent implements OnInit {
  @Input() instructor: InstructorLite;

  public quillConfig = {
    toolbar: false,
  };

  public form: FormGroup = this.fb.group({
    username: [null, [Validators.required, Validators.email]],
    firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    lastName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.instructor) {
      this.form.patchValue({
        username: this.instructor.username,
        firstName: this.instructor.firstName,
        lastName: this.instructor.lastName,
      });

      if (this.instructor.lxpUser) {
        this.form.get('firstName').disable();
        this.form.get('lastName').disable();
      }
      this.form.get('username').disable();
    }
  }
}
