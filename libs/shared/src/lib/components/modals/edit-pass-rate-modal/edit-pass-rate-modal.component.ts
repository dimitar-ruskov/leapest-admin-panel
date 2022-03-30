import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'leap-edit-pass-rate-modal',
  templateUrl: './edit-pass-rate-modal.component.html',
  styleUrls: ['./edit-pass-rate-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPassRateModalComponent implements OnInit {
  constructor(private readonly fb: FormBuilder) {}

  form: FormGroup;

  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal = 0;

  formatterPercent = (value: number) => value;
  parserPercent = (value: string): string => {
    const maxValue = 100;
    const parsedValue = parseFloat(value);

    if (parsedValue >= 0 && parsedValue <= maxValue) {
      return value.toString();
    } else if (parsedValue > maxValue) {
      return maxValue.toString();
    } else {
      return '';
    }
  };

  ngOnInit(): void {
    this.form = this.fb.group({
      numberInput: [this.initVal, [Validators.required]],
    });
  }
}
