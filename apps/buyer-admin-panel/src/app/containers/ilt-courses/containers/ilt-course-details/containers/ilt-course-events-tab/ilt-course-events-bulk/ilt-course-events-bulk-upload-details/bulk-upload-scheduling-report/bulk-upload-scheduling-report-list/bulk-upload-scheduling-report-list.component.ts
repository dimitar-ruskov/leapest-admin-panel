import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Observable } from "rxjs";

import {
  ChangeSchedulingReportPaginationParams,
  CourseEventsBulkUploadsSchedulingReportByType,
  CourseEventsBulkUploadsSchedulingSummary,
  ResetSchedulingReportState
} from "../../../state/ilt-course-events-bulk.actions";
import { IltCourseEventsBulkUploadsState } from "../../../state/ilt-course-events-bulk.state";

import {
  createPageableFromTableQueryParams
} from "../../../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import { PublishingReportByStatus } from "../../../../../../../../../../../../../../libs/shared/src/lib/models";

@Component({
  selector: 'leap-bulk-upload-scheduling-report-list',
  templateUrl: './bulk-upload-scheduling-report-list.component.html',
  styleUrls: ['./bulk-upload-scheduling-report-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUploadSchedulingReportListComponent implements OnInit {
  @Input() status: string;
  @Input() csvId: number;

  @Select(IltCourseEventsBulkUploadsState.schedulingReport)
  schedulingReport$: Observable<PublishingReportByStatus>;

  @Select(IltCourseEventsBulkUploadsState.loading)
  loading$: Observable<boolean>;

  @Select(IltCourseEventsBulkUploadsState.total)
  total$: Observable<boolean>;

  @Select(IltCourseEventsBulkUploadsState.schedulingPageIndex)
  pageIndex$: Observable<number>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetSchedulingReportState());
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeSchedulingReportPaginationParams({ pageable }),
      new CourseEventsBulkUploadsSchedulingReportByType({ status: this.status, csvId: this.csvId }),
      new CourseEventsBulkUploadsSchedulingSummary(this.csvId),
    ]);
  }
}
