import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AdminCoursesService} from "../../../utils/services";

@Component({
  selector: 'leap-edit-external-sku-modal',
  templateUrl: './edit-external-sku-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditExternalSKUModalComponent implements OnInit {
  form: FormGroup;

  @Input() mainLabel: string;
  @Input() subLabel: string;
  @Input() initVal = '';
  @Input() minLength = 0;
  @Input() maxLength = 256;
  @Input() pattern = /.*/;
  @Input() specificExternalSKU: boolean;

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      externalSKU: [
        this.initVal,
        [Validators.minLength(this.minLength), Validators.maxLength(this.maxLength), Validators.pattern(this.pattern)],
        [this.adminCoursesService.existingSKUAsyncValidator(this.specificExternalSKU, this.initVal)],
      ],
    });
  }
}
