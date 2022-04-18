import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'leap-resend-email-modal',
  templateUrl: './resend-email-modal.component.html',
  styleUrls: ['./resend-email-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResendEmailModalComponent {
  @Input() recipientName: string;
  @Input() recipientRole: string;
  @Input() recipientEmail: string;

  @Input() trigger: { configKey: string; configValue: string };
  @Input() subject: string;
  @Input() updatedAt: Date;

  constructor() {}
}
