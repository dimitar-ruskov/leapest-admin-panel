import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {IKeyValuePair} from "../../../models";

@Component({
  selector: 'leap-edit-level-modal',
  templateUrl: './edit-level-modal.component.html',
  styleUrls: ['./edit-level-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLevelModalComponent implements OnInit {
  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal: any;
  @Input() options: IKeyValuePair[];

  constructor(private readonly fb: FormBuilder) {}

  form: FormGroup;
  defaultLevel = '';

  get isDisabledClearSection(): boolean {
    return this.form.get('levelId').value === this.defaultLevel;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      levelId: [this.initVal],
    });

    this.defaultLevel = this.options[0].key;
  }

  clearSection(): void {
    this.form.patchValue({
      levelId: this.defaultLevel,
    });
    this.form.markAsDirty();
  }
}
