import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { DeferredResource } from '../../../../snatch/utils/deferred-resource';

@Component({
  selector: 'leap-notification-preview-modal',
  templateUrl: './notification-preview-modal.component.html',
  styleUrls: ['./notification-preview-modal.component.less'],
})
export class NotificationPreviewModalComponent implements OnInit {
  @Input() previewTemplate$: Observable<DeferredResource<string>>;

  constructor() {}

  ngOnInit(): void {}
}
