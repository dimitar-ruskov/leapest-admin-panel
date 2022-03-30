import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'leap-general-info-field',
  templateUrl: './general-info-field.component.html',
  styleUrls: ['./general-info-field.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoFieldComponent {
  @Input() fieldTitle: string;
  @Input() editable: boolean;

  @Output() edit: EventEmitter<void> = new EventEmitter<void>();
}
