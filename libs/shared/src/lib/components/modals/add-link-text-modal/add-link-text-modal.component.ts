import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'leap-add-link-text-modal',
  templateUrl: './add-link-text-modal.component.html',
  styleUrls: ['./add-link-text-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddLinkTextModalComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(256)]],
    });
  }
}
