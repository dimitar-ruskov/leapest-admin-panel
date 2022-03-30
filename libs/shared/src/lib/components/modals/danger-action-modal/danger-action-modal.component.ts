import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'leap-danger-action-modal',
  templateUrl: './danger-action-modal.component.html',
  styleUrls: ['./danger-action-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DangerActionModalComponent implements OnInit {
  @Input() mainExp: string;
  @Input() subExp?: string;
  @Input() boxLines?: string[];
  @Input() reasonRequired: boolean = false;
  form: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      reason: [null, this.reasonRequired ? [Validators.required, Validators.maxLength(1500)] : null]
    })
  }

}
