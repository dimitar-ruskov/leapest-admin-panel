import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ILTEvent } from '../../../models/ilt-event.model';
import { AdminCoursesService } from '../../../utils/services/admin-courses.service';

@Component({
  selector: 'leap-delete-course-confirm-modal',
  templateUrl: './delete-course-confirm-modal.component.html',
  styleUrls: ['./delete-course-confirm-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class DeleteCourseConfirmModalComponent implements OnInit, OnDestroy {
  @Input() courseId: string;

  draftEvents: ILTEvent[] = [];
  loading = true;

  constructor(private readonly courseService: AdminCoursesService, private readonly detector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.courseService
      .getDraftEventsByCourse(this.courseId)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.loading = false;
          this.draftEvents = res.response;
          this.detector.detectChanges();
        }
        if (res.error) {
          this.loading = false;
          this.detector.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    //od
  }

  formatDate(dt: string) {
    return dt ? moment(dt).format('DD MM yyyy') : 'N/A';
  }
}
