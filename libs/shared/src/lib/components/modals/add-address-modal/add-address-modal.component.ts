import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {IKeyValuePair} from "../../../models";

@Component({
  selector: 'leap-add-address-modal',
  templateUrl: './add-address-modal.component.html',
  styleUrls: ['./add-address-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAddressModalComponent {

  @Input() countries?: IKeyValuePair[];
  @Input() states?: IKeyValuePair[];
  form: FormGroup = this.fb.group({
    country: [null, Validators.required],
    state: [null, Validators.required],
    city: [null, Validators.required],
    province: [],
    postalCode: [null, Validators.required],
    address: [null, Validators.required],
    houseNumber: [],
    room: []
  });

  constructor(private fb: FormBuilder) {

  }
}
