import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CustomValidators} from "../../../utils/common";

@Component({
  selector: 'leap-add-link-modal',
  templateUrl: './add-link-modal.component.html',
  styleUrls: ['./add-link-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddLinkModalComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      link: ['', [Validators.required, CustomValidators.url]],
    });
  }
}
