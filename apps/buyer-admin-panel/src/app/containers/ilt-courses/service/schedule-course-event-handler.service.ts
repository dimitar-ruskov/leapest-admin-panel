import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

import { ScheduleILTCourseEvent } from "../containers/ilt-courses-list/state/ilt-courses-list.actions";
import { ILTEventBase, PublishedILTCourse } from "../../../../../../../libs/shared/src/lib/models";
import {
  EventCreateModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/event-create-modal/event-create-modal.component";

@Injectable({
  providedIn: 'root',
})
export class ScheduleCourseEventHandlerService {
  constructor(
    private readonly modalService: NzModalService,
    private readonly store: Store,
  ) {}

  scheduleCourseEvent(publishedILTCourse: PublishedILTCourse): void {
    const courseId = publishedILTCourse.id;

    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'What would you like to create?',
      nzContent: EventCreateModalComponent,
      nzComponentParams: {
        selectedCourseId: courseId,
        selectedCourseName: publishedILTCourse.name,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => !d.eventCreationForm.valid,
          onClick: async (data) => {
            const formValue = data.eventCreationForm.getRawValue();
            const preCourseEvent: ILTEventBase = {
              classEvent: { virtualVenue: formValue.virtual },
              course: { id: formValue.courseId },
              historical: formValue.historical,
              isInternal: publishedILTCourse.isInternal,
            };

            return this.store
              .dispatch(new ScheduleILTCourseEvent({ preCourseEvent }))
              .toPromise()
              .then(() => modal.destroy());
          },
        },
      ],
    });
  }
}
