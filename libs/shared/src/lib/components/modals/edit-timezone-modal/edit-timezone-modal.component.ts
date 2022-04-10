import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import {IKeyValuePair} from "../../../models/interfaces";

@Component({
  selector: 'leap-edit-timezone-modal',
  templateUrl: './edit-timezone-modal.component.html',
  styleUrls: ['./edit-timezone-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTimezoneModalComponent implements OnInit {

  form: FormGroup= this.fb.group({
    timezone: [null, [Validators.required]]
  });

  @Select(state => state.core.dictionaries.timezones)
  timezonesDict$: Observable<IKeyValuePair[]>;

  @Input() timezone: string;

  constructor(private readonly fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.form.patchValue({
      timezone: this.timezone
    });
  }
}
