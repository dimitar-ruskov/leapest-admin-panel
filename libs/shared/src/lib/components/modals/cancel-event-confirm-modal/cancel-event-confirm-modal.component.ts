import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'leap-cancel-event-confirm-modal',
  templateUrl: './cancel-event-confirm-modal.component.html',
  styleUrls: ['./cancel-event-confirm-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelEventConfirmModalComponent implements OnInit {
  @Input() name: string;
  @Input() date: string;
  @Input() learnerCount: number;

  form: FormGroup;
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      reason: [null, [Validators.required, Validators.maxLength(1500)]],
    });
  }
}
