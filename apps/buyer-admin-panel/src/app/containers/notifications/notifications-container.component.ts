import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-notifications',
  templateUrl: './notifications-container.component.html',
  styleUrls: ['./notifications-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
