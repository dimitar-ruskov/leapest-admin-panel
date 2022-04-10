import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd/modal';

import { SpCoursesListState } from '../containers/sp-courses-list/state/sp-courses-list.state';
import { ActiveSelfPacedCourse } from '../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import {
  PreSPCourseLanguageVariantCreatePayload
} from '../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course-language-variant.model';
import {
  CreateVariantModalComponent
} from "../containers/sp-course-details/containers/sp-course-variants/sp-course-variant-create/modals/create-language-variant-modal/create-variant-modal.component";
import {
  CreatePreSPCourseLanguageVariant
} from "../containers/sp-course-details/containers/sp-course-variants/sp-course-variant-create/state/sp-course-variant-create.actions";

@Injectable({
  providedIn: 'root'
})
export class CreateSpCourseVariantHandlerService {

  constructor(private readonly modalService: NzModalService,
              private readonly store: Store) {
  }

  createSpCourseLanguageVariant(activeSelfPacedCourse: ActiveSelfPacedCourse): void {
    const courseId = activeSelfPacedCourse.id;
    const modal = this.modalService.create({
      nzTitle: 'Create New Language Variant?',
      nzContent: CreateVariantModalComponent,
      nzComponentParams: {
        courseName: activeSelfPacedCourse.name,
        languageDictionary: this.store.selectSnapshot(SpCoursesListState.languageDictionary)
      },
      nzWidth: 660,
      nzWrapClassName: 'modal-class',
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy()
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (instance) => instance.form.invalid,
          onClick: (instance) => {
            const { language } = instance.form.getRawValue();
            const preSPCourseLanguageVariant: PreSPCourseLanguageVariantCreatePayload = {
              course: {id: courseId},
              classEvent: {
                virtualVenue: true,
                selfPacedClass: true,
                displayName: language
              },
              historical: false,
              isInternal: true,
              language: {
                configKey: language
              }
            };

            return this.store.dispatch(new CreatePreSPCourseLanguageVariant({preSPCourseLanguageVariant, courseId }))
              .toPromise()
              .then(() => modal.destroy());
          }
        }
      ]
    });
  }
}
