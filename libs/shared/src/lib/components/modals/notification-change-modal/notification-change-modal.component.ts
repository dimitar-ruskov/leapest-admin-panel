import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {NotificationResetLevel} from "../../../models/notifications/notifications.model";

@Component({
  selector: 'leap-notification-change-modal',
  templateUrl: './notification-change-modal.component.html',
  styleUrls: ['./notification-change-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationChangeModalComponent implements OnInit {
  @Input() isReset?: boolean;
  @Input() level?: string = NotificationResetLevel.DEFAULT;

  constructor() {}

  ngOnInit(): void {}
}
