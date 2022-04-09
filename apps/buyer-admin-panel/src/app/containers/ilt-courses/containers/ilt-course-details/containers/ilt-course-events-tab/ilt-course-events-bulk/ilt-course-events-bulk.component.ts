import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { IltCourseEventsBulkService } from './service/ilt-course-events-bulk.service';
import { IltCourseEventsBulkUploadsState } from './state/ilt-course-events-bulk.state';
import {
  ChangeEventUploadsPaginationParams,
  CourseEventsCsvUploadsList,
  ResetCourseEventsCsvUploadsListState,
} from './state/ilt-course-events-bulk.actions';

import {createPageableFromTableQueryParams} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {EnvironmentService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services/common";
import {
  CourseEventsBulkUploads
} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces/courses/ilt-course-events-bulk";
import {BulkUploadModalComponent} from "./components/bulk-upload-modal/bulk-upload-modal.component";

@Component({
  selector: 'leap-ilt-course-events-bulk',
  templateUrl: './ilt-course-events-bulk.component.html',
  styleUrls: ['./ilt-course-events-bulk.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseEventsBulkComponent implements OnInit {
  @Input() sku: string;
  @Input() parentId: string;

  @Select(IltCourseEventsBulkUploadsState.bulkUploads)
  bulkUploads$: Observable<CourseEventsBulkUploads[]>;

  @Select(IltCourseEventsBulkUploadsState.loading)
  loading$: Observable<boolean>;

  @Select(IltCourseEventsBulkUploadsState.total)
  total$: Observable<boolean>;

  @Select(IltCourseEventsBulkUploadsState.pageIndex)
  pageIndex$: Observable<number>;

  courseId: string;
  templateLink: string;

  trackByFn: TrackByFunction<CourseEventsBulkUploads> = (index, item) => item.id;

  constructor(
    private readonly modalService: NzModalService,
    private readonly store: Store,
    private readonly service: IltCourseEventsBulkService,
    public environment: EnvironmentService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.templateLink = `${this.environment.s3Url}/${this.environment.umbrellaUploadsBucket}/Course_Event_Bulk_Upload_Template_Description_Sample.csv`;
    this.store.dispatch(new ResetCourseEventsCsvUploadsListState());
    this.courseId = this.route.snapshot.paramMap.get('id');
  }

  public getStatusIcon(status: string): string {
    let iconClass: string;
    switch (status) {
      case 'pending-validation' || 'course-events-in-progress':
        iconClass = 'fa fa-hourglass-o';
        break;
      case 'validation-failed':
        iconClass = 'fal fa-times';
        break;
      case 'validation-completed':
        iconClass = 'fal fa-check';
        break;
      case 'course-events-were-created':
        iconClass = 'fal fa-calendar-check-o';
        break;
      case 'course-events-were-failed':
        iconClass = 'fal fa-calendar-times-o';
        break;
      default:
        iconClass = '';
    }
    return iconClass + ' status-icon';
  }

  public bulkUpload(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Bulk Upload (Events)',
      nzContent: BulkUploadModalComponent,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Upload',
          type: 'primary',
          disabled: (d) => d.form.invalid,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            formValue.courseSku = this.sku;
            this.service
              .uploadCSV(formValue, this.courseId)
              .toPromise()
              .then((result) => {
                this.openSuccessModal();
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  openSuccessModal() {
    const content =
      'Your CSV was successfully uploaded, and we are now validating its contents. \n' +
      'A report listing any potential issues will be generated and made available to you, under the <i>Bulk Uploads</i> tab. \n' +
      'From the report, you will be able to finish scheduling all events passing this validation.  \n' +
      'You will be notified when the report is ready.';
    this.modalService.confirm({
      nzTitle: 'CSV Uploaded',
      nzClassName: 'bulk-upload-confirm-modal',
      nzContent: content,
      nzCancelText: null,
      nzOkText: 'Close',
      nzOkType: 'default',
      nzIconType: null,
      nzWidth: 660,
      nzOnOk: () => {
        this.store.dispatch(new CourseEventsCsvUploadsList({ courseSku: this.sku }));
      },
    });
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);
    this.store.dispatch([
      new ChangeEventUploadsPaginationParams({ pageable }),
      new CourseEventsCsvUploadsList({ courseSku: this.sku }),
    ]);
  }

  public refreshTable(): void {
    this.store.dispatch(new CourseEventsCsvUploadsList({ courseSku: this.sku }));
  }

  public downloadTemplate(): void {
    const link = `${this.environment.s3Url}/${this.environment.umbrellaUploadsBucket}/Course_Event_Bulk_Upload_Template_Data.csv`;
    window.open(link);
  }
}
