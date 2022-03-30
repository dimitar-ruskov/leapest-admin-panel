import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ILTCourseCategory } from '../../../models/ilt-course.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IKeyValuePair } from '../../../../core/model/dictionary.model';

@Component({
  selector: 'leap-create-sub-category-modal',
  templateUrl: './create-sub-category-modal.component.html',
  styleUrls: ['./create-sub-category-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CreateSubCategoryModalComponent implements OnInit, OnDestroy {
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
  @Input() category: ILTCourseCategory;
  @Input() subCategoryDictionary: ILTCourseCategory[];

  charLimit = 1500;
  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    description: [null],
    keywords: [null],
  });

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get keywordsControl(): FormControl {
    return this.form.get('keywords') as FormControl;
  }

  keywordsControlOptions$: Observable<IKeyValuePair[]>;

  @Output() searchKeywords: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(untilDestroyed(this)).subscribe((res) => {
      if (!res) {
        return;
      }

      this.nameControl.setErrors(
        this.subCategoryDictionary.map((x) => x.name.toLocaleUpperCase()).includes(res.toLocaleUpperCase())
          ? { notUnique: true }
          : null,
      );
    });
  }

  ngOnDestroy() {}

  onInputKeyword(search: string): void {
    if (search) {
      this.searchKeywords.emit(search);
    }
  }

  onRemoveKeyword(key: string) {
    const keywords = [...this.keywordsControl.value];
    const keywordIndex = keywords.findIndex((k) => k === key);

    keywords.splice(keywordIndex, 1);

    this.keywordsControl.patchValue(keywords);
  }
}
