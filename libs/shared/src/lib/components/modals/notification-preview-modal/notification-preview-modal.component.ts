import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {DeferredResource} from "../../../utils/common";


@Component({
  selector: 'leap-notification-preview-modal',
  templateUrl: './notification-preview-modal.component.html',
  styleUrls: ['./notification-preview-modal.component.less'],
})
export class NotificationPreviewModalComponent {
  @Input() previewTemplate$: Observable<DeferredResource<string>>;

  constructor() {}

}
