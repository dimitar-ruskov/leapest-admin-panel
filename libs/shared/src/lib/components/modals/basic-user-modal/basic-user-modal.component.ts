import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'leap-basic-user-modal',
  templateUrl: './basic-user-modal.component.html',
  styleUrls: ['./basic-user-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicUserModalComponent implements OnInit {
  @Input() userLabel = 'user'

  form: FormGroup = this.fb.group({
    username: [null, [Validators.required, Validators.email]],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required]
  });

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {}
}
