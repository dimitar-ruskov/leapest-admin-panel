import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'leap-edit-certificate-period',
  templateUrl: './edit-certificate-period.component.html',
  styleUrls: ['./edit-certificate-period.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditCertificatePeriodComponent implements OnInit {
  form: FormGroup;
  private previousValue: number;

  @Input() initVal = 0;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      validityPeriod: [this.initVal, [Validators.required]],
      agree: [false],
    });

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
