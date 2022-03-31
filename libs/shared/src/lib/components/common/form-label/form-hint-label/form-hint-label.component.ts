import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-form-hint-label',
  template: '<ng-content></ng-content>',
  styleUrls: ['./form-hint-label.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormHintLabelComponent {
}
