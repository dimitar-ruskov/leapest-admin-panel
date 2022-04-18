import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {CourseCategory} from "../../../models";

@Component({
  selector: 'leap-create-category-modal',
  templateUrl: './create-category-modal.component.html',
  styleUrls: ['./create-category-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CreateCategoryModalComponent implements OnInit, OnDestroy {
  @Input() categoryDictionary: CourseCategory[];

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    },
  };

  @Input() minLength = 1;
  @Input() maxLength = 1500;

  charLimit = 1500;
  form: FormGroup = this.fb.group({
    description: [null],
    name: [null, [Validators.required]],
  });

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(untilDestroyed(this)).subscribe((res) => {
      if (!res) {
        return;
      }

      if (this.categoryDictionary.map((x) => x.name.toLocaleUpperCase()).includes(res.toLocaleUpperCase())) {
        this.nameControl.setErrors({ notUnique: true });
      } else {
        this.nameControl.setErrors(null);
      }
    });
  }

  ngOnDestroy() {}
}
