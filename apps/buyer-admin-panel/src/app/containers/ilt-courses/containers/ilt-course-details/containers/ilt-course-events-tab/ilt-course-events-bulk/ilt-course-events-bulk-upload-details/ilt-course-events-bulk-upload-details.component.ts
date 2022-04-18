import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { IltCourseEventsBulkService } from '../../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-course-events-bulk.service';
import { IltCourseEventsBulkUploadsState } from '../state/ilt-course-events-bulk.state';
import {
  ChangeReportTab,
  CourseEventsBulkUploadsSchedulingSummary,
  CourseEventsBulkUploadsValidationReport,
} from '../state/ilt-course-events-bulk.actions';

import {
  BulkUploadsSchedulingSummary, BulkUploadsValidationReport
} from "../../../../../../../../../../../../libs/shared/src/lib/models/courses/ilt-courses/ilt-course-events-bulk";

@Component({
  selector: 'leap-ilt-course-events-bulk-upload-details',
  templateUrl: './ilt-course-events-bulk-upload-details.component.html',
  styleUrls: ['./ilt-course-events-bulk-upload-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseEventsBulkUploadDetailsComponent implements OnInit {
  @Select(IltCourseEventsBulkUploadsState.validationReport)
  validationReport$: Observable<BulkUploadsValidationReport>;

  @Select(IltCourseEventsBulkUploadsState.schedulingSummary)
  schedulingSummary$: Observable<BulkUploadsSchedulingSummary>;

  @Select(IltCourseEventsBulkUploadsState.activeTab)
  activeTab$: Observable<number>;

  courseId: string;
  csvId: string;
  fileName: string;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly service: IltCourseEventsBulkService,
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.csvId = this.route.snapshot.paramMap.get('csvId');
    this.store.dispatch([
      new CourseEventsBulkUploadsValidationReport(this.csvId),
      new CourseEventsBulkUploadsSchedulingSummary(+this.csvId),
    ]);
    this.validationReport$.pipe(untilDestroyed(this)).subscribe((report) => (this.fileName = report?.fileName));
    this.store.dispatch(new ChangeReportTab({ activeTab: 0 }));
  }

  startEventScheduling<A>(dispatchAction: () => Observable<A>): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Start Event Scheduling?',
      nzContent:
        `You are about to start the automatic creation of the products listed in ${this.fileName}.\n` +
        'Any entries with reported issues will be ignored. These can be uploaded later, in a corrected .csv file.\n' +
        'This action cannot be undone. How do you wish to proceed?',
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzOkText: 'Proceed',
      nzOnOk: async () => {
        return this.service
          .scheduleEvent(this.csvId)
          .toPromise()
          .then((_) => {
            this.store.dispatch(new CourseEventsBulkUploadsSchedulingSummary(+this.csvId));
            modal.destroy();
          });
      },
    });
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeReportTab({ activeTab }));
  }
}
