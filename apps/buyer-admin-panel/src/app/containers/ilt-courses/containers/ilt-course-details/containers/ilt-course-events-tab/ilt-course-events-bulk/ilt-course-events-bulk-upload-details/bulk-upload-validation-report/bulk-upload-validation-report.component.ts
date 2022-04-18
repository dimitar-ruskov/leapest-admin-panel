import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

import {
  BulkUploadValidationReportIssuesModalComponent
} from "../../../../../../../../../../../../../libs/shared/src/lib/components/modals/bulk-upload-validation-report-issues-modal/bulk-upload-validation-report-issues-modal.component";
import {
  BulkUploadsValidationReport,
  BulkUploadsValidationReportErrors
} from "../../../../../../../../../../../../../libs/shared/src/lib/models";
import {
  DownloadSphinxService
} from "../../../../../../../../../../../../../libs/shared/src/lib/services/common/download-sphinx.service";

@Component({
  selector: 'leap-bulk-upload-validation-report',
  templateUrl: './bulk-upload-validation-report.component.html',
  styleUrls: ['./bulk-upload-validation-report.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUploadValidationReportComponent {
  @Input() data: BulkUploadsValidationReport;
  @Input() courseId: string;

  constructor(
    private readonly downloadSphinxService: DownloadSphinxService,
    private readonly modalService: NzModalService,
  ) {}

  public downloadCSV(): void {
    const link = this.downloadSphinxService.getSphinxUrl(this.data.csvBucket, this.data.csvKey);
    window.open(link);
  }

  public openErrorDetailsModal(data: BulkUploadsValidationReportErrors): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Issues',
      nzContent: BulkUploadValidationReportIssuesModalComponent,
      nzComponentParams: { data },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzCancelText: null,
      nzOkText: 'Close',
      nzOkType: 'default',
      nzOnOk: async () => {
        return modal.destroy();
      },
    });
  }
}
