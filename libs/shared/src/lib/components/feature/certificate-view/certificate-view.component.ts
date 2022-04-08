import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import {CertificateInfo} from "../../../models/interfaces";
import {EnvironmentService} from "../../../utils/services/common";

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
