import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilService {
  constructor() {}

  triggerValidation(form: FormGroup, onlySelf: boolean = false): boolean {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty({ onlySelf });
        control.updateValueAndValidity({ onlySelf });
      }
    }

    return form.valid;
  }
}
