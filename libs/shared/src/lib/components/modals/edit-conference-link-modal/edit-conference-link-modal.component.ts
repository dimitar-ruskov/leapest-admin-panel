import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../common/validators/custom-validators';


@Component({
  selector: 'leap-edit-conference-link-modal',
  templateUrl: './edit-conference-link-modal.component.html',
  styleUrls: ['./edit-conference-link-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditConferenceLinkModalComponent implements OnInit {

  form: FormGroup = this.fb.group({
    conferenceLink: ['', [Validators.required, CustomValidators.url]]
  });

  @Input() conferenceLink: string;

  constructor(private readonly fb: FormBuilder) {
   
  }

  ngOnInit(): void {
    this.form.patchValue({
      conferenceLink: this.conferenceLink
    });
  }
}
