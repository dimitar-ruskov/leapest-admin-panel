import { Component, ChangeDetectionStrategy, TrackByFunction, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { IKeyValuePair } from '../../../../core/model/dictionary.model';
import { AdminCoursesService } from '../../../utils/services/admin-courses.service';

@Component({
  selector: 'leap-create-new-course-modal',
  templateUrl: './create-new-course-modal.component.html',
  styleUrls: ['./create-new-course-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewCourseModalComponent {
  form: FormGroup;

  @Input() languageDictionary: IKeyValuePair[] = [];

  trackByFn: TrackByFunction<IKeyValuePair> = (index, item) => item.key;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modalRef: NzModalRef,
    private readonly adminCoursesService: AdminCoursesService,
  ) {
    this.form = this.fb.group({
      name: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(80)],
        [
          this.adminCoursesService.existingNameAsyncValidator({
            isCourse: true,
          }),
        ],
      ],
      languages: ['English-(en-US)', Validators.required],
    });
  }
}
