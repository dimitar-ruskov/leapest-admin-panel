import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'leap-text-input-modal',
  templateUrl: './text-input-modal.component.html',
  styleUrls: ['./text-input-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputModalComponent implements OnInit {
  form: FormGroup;

  @Input() modalExplanation: string;
  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal = '';
  @Input() minLength = 1;
  @Input() maxLength = 1500;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      textInput: [
        this.initVal,
        [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)],
      ],
    });
  }
}
