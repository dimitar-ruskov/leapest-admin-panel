import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'leap-edit-waiting-list-modal',
  templateUrl: './edit-waiting-list-modal.component.html',
  styleUrls: ['./edit-waiting-list-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditWaitingListModalComponent implements OnInit {
  @Input() enabled: boolean;
  @Input() size: number;
  @Input() minSize: number;

  form: FormGroup = this.fb.group({
    enabled: [null],
    size: [null],
  });

  get isEnabled(): FormControl {
    return this.form.get('enabled') as FormControl;
  }

  get wSize(): FormControl {
    return this.form.get('size') as FormControl;
  }

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({
      enabled: this.enabled,
      size: this.size,
    });
    this.isEnabled.valueChanges.pipe(startWith(this.enabled), untilDestroyed(this)).subscribe((val) => {
      val ? this.wSize.enable() : this.wSize.disable();
    });
  }
}
