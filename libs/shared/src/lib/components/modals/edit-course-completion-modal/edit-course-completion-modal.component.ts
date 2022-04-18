import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {getOptionsFromMap} from "../../../utils/common";
import {COURSE_COMPLETION_OPTIONS_MAP} from "../../../models/events/registration-options";
import {IKeyValuePair} from "../../../models";

@Component({
  selector: 'leap-edit-course-completion-modal',
  templateUrl: './edit-course-completion-modal.component.html',
  styleUrls: ['./edit-course-completion-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCourseCompletionModalComponent implements OnInit {
  courseCompletionOptions: IKeyValuePair[] = [];

  form: FormGroup = this.fb.group({
    automaticCourseCompletion: [true, Validators.required],
  });

  @Input() automaticCourseCompletion: boolean;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.courseCompletionOptions = getOptionsFromMap(COURSE_COMPLETION_OPTIONS_MAP);
    this.form.patchValue({
      automaticCourseCompletion: this.automaticCourseCompletion,
    });
  }
}
