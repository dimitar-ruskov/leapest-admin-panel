import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'leap-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLabelComponent {
  requiredLabel = '*';
  optionalLabel = 'Optional';

  @Input() required: boolean;
}
