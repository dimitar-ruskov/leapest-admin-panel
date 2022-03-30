import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCoursesService } from '../../../services/admin-courses.service';

@Component({
  selector: 'leap-edit-course-name-modal',
  templateUrl: './edit-course-name-modal.component.html',
  styleUrls: ['./edit-course-name-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCourseNameModalComponent implements OnInit {
  form: FormGroup;

  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal = '';
  @Input() minLength = 1;
  @Input() maxLength = 1500;

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      textInput: [
        this.initVal,
        [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)],
        [
          this.adminCoursesService.existingNameAsyncValidator({
            isCourse: true,
          }),
        ],
      ],
    });
  }
}
