import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CertificateInfo } from "../../../models";

import { EnvironmentService } from "../../../services/common/environment.service";

@Component({
  selector: 'leap-certificate-view',
  templateUrl: './certificate-view.component.html',
  styleUrls: ['./certificate-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateViewComponent {
  @Input() settings: CertificateInfo;
  @Input() disabled = false;
  @Output() download: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() preview: EventEmitter<void> = new EventEmitter<void>();

  constructor(public readonly environment: EnvironmentService) {}
}
