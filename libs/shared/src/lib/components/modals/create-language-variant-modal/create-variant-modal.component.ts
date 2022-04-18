import { Component, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {IKeyValuePair} from "../../../models";

@Component({
  selector: 'leap-create-variant-modal',
  templateUrl: './create-variant-modal.component.html',
  styleUrls: ['./create-variant-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVariantModalComponent {
  @Input() courseName: string;
  @Input() languageDictionary: IKeyValuePair[] = [];

  form: FormGroup;

  trackByFn: TrackByFunction<IKeyValuePair> = (index, item) => item.key;

  get languageControl(): FormControl {
    return this.form.get('language') as FormControl;
  }

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      language: ['', Validators.required],
    });
  }
}
