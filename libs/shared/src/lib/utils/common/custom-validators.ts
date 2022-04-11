import { AbstractControl, ValidationErrors } from '@angular/forms';
import {urlRegexp} from "../../models/constants";

export class CustomValidators {
  static url(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const valid = !!urlRegexp.test(control.value);

    if (!valid) {
      return { invalidUrl: { message: 'Please enter a valid url' } };
    } else {
      return null;
    }
  }

  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;

    if (!isValid) {
      return { emptyField: { message: 'Please enter some value' } };
    } else {
      return null;
    }
  }

  static composerNoWhitespace(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || [])
      .map((paragraph) => paragraph.children.every((child) => (child.text || '').trim().length === 0))
      .every((paragraph) => paragraph);

    const isValid = !isWhitespace;

    if (!isValid) {
      return { emptyComposer: { message: 'Please enter some text to composer' } };
    } else {
      return null;
    }
  }

  static composerMaxLength(control: AbstractControl, maxLength = 256): ValidationErrors | null {
    const lineLength = (control.value || [])
      .map((paragraph) =>
        paragraph.children.reduce((acc, curr) => {
          if (!curr.type) {
            acc += curr.text.length;
          }
          return acc;
        }, 0),
      )
      .reduce((acc, curr) => {
        acc += curr;
        return acc;
      }, 0);

    const isValid = lineLength <= maxLength;

    if (!isValid) {
      return { composerMaxLength: { message: `Max length is ${maxLength}` } };
    } else {
      return null;
    }
  }
}
