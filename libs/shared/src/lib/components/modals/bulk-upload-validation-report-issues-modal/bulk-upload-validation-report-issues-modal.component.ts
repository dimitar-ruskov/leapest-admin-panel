import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  BulkUploadsValidationReportErrors
} from "../../../models/courses/ilt-courses/ilt-course-events-bulk";

@Component({
  selector: 'leap-bulk-upload-validation-report-issues-modal',
  templateUrl: './bulk-upload-validation-report-issues-modal.component.html',
  styleUrls: ['./bulk-upload-validation-report-issues-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUploadValidationReportIssuesModalComponent {
  @Input() data: BulkUploadsValidationReportErrors;
}
