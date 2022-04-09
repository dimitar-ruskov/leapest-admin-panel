import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'leap-notification-filter-pill',
  templateUrl: './notification-filter-pill.component.html',
  styleUrls: ['./notification-filter-pill.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationFilterPillComponent {
  @Output() removed = new EventEmitter();

  constructor() {}
}
