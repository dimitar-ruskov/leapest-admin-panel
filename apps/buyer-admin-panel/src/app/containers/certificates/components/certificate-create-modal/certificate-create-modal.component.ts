import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CertificateUploadFileComponent } from '../certificate-upload-file/certificate-upload-file.component';

@Component({
  selector: 'leap-certificate-create-modal',
  templateUrl: './certificate-create-modal.component.html',
  styleUrls: ['./certificate-create-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CertificateCreateModalComponent implements OnInit {
  private previousValue: number;

  @ViewChild('uploadComponent', { static: true }) uploadComponent: CertificateUploadFileComponent;

  form: FormGroup = this.fb.group({
    displayName: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
    validityPeriod: [1, Validators.required],
    agree: [false],
  });

  get contents(): FormArray {
    return this.form.get('_contents') as FormArray;
  }

  get validCertificate(): boolean {
    return this.uploadComponent.validFile && this.form.valid;
  }

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form
      .get('validityPeriod')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value <= 0 || !Number(value)) {
          this.form.get('agree').setValue(true, { onlySelf: true, emitEvent: false });
          this.form.get('validityPeriod').disable({ onlySelf: true, emitEvent: false });
          return;
        }
        this.previousValue = value;
      });
  }

  public expireChecked(value: boolean): void {
    if (value) {
      this.form.get('validityPeriod').disable({ onlySelf: true, emitEvent: false });
    } else {
      this.form.get('validityPeriod').enable({ onlySelf: true, emitEvent: false });
    }
  }
}
