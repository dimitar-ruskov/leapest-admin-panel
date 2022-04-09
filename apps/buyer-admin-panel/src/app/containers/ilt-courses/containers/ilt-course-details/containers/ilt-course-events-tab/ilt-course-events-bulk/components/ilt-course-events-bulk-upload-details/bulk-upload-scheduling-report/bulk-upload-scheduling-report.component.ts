import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CourseEventsBulkUploadsSchedulingSummary } from '../../../state/ilt-course-events-bulk.actions';
import { IltCourseEventsBulkUploadsState } from '../../../state/ilt-course-events-bulk.state';
import {
  BulkUploadsValidationReport
} from "../../../../../../../../../../../../../../libs/shared/src/lib/models/interfaces/courses/ilt-course-events-bulk";
import {
  DownloadSphinxService
} from "../../../../../../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-bulk-upload-scheduling-report',
  templateUrl: './bulk-upload-scheduling-report.component.html',
  styleUrls: ['./bulk-upload-scheduling-report.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUploadSchedulingReportComponent implements OnInit {
  @Input() data: BulkUploadsValidationReport;
  csvId: number;
  status: string;

  @Select(IltCourseEventsBulkUploadsState.schedulingSummary)
  schedulingSummary$: Observable<BulkUploadsValidationReport>;

  @Select(IltCourseEventsBulkUploadsState.schedulingSummaryLoading)
  schedulingSummaryLoading$: Observable<BulkUploadsValidationReport>;

  constructor(private readonly store: Store, private readonly downloadSphinxService: DownloadSphinxService) {}

  ngOnInit(): void {
    this.csvId = this.data?.id;
  }

  public downloadCSV(): void {
    const link = this.downloadSphinxService.getSphinxUrl(this.data.csvBucket, this.data.csvKey);
    window.open(link);
  }

  public refreshSchedulingSummary(): void {
    this.store.dispatch(new CourseEventsBulkUploadsSchedulingSummary(this.csvId));
  }
}
