import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'leap-quill-input-modal',
  templateUrl: './quill-input-modal.component.html',
  styleUrls: ['./quill-input-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuillInputModalComponent implements OnInit {
  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal = '';
  @Input() minLength = 1;
  @Input() maxLength = 1500;
  @Input() quillConfig: any;
  @Input() required: boolean;

  form: FormGroup;
  inputControl: FormControl;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    const validators = [Validators.maxLength(this.maxLength)];

    if (this.required) {
      validators.push(Validators.required);
    }

    this.form = this.fb.group({
      quillInput: [this.initVal, validators],
      propagateAttributes: [true],
    });
    this.inputControl = this.form.get('quillInput') as FormControl;
  }
}
