import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IKeyValuePair } from '../../../../core/model/dictionary.model';

@Component({
  selector: 'leap-select-input-modal',
  templateUrl: './select-input-modal.component.html',
  styleUrls: ['./select-input-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputModalComponent implements OnInit {
  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal: any;
  @Input() options: IKeyValuePair[];

  constructor(private readonly fb: FormBuilder) {}

  form: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      selectInput: [this.initVal, [Validators.required]],
    });
  }
}
