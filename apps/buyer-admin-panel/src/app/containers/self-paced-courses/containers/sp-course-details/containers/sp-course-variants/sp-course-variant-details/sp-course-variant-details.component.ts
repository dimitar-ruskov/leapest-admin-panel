import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import produce, { Draft } from 'immer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import {
  AssignLearnersToLanguageVariant,
  ChangeSPCourseLanguageVariantDetailsTab,
  GetSPCourseLanguageVariant,
  UpdateSPCourseLanguageVariantAttribute,
  UploadLearnersFromCSVToLanguageVariant,
} from './state/sp-course-variant-details.actions';
import { GetSPCourseLanguageVariantLearnersEnrolled } from './state/sp-course-variant-learners/sp-course-variant-learners-enrolled.actions';
import { GetSPCourseLanguageVariantExams } from './state/sp-course-variant-exams/sp-course-variant-exams.actions';
import { SpCourseVariantDetailsState } from './state/sp-course-variant-details.state';

import { SPCourseLanguageVariant } from '../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course.model';
import { SPCourseLanguageVariantLearner } from '../../../../../../../../../../../libs/shared/src/lib/models/interfaces/sp-courses/sp-course-language-variant-learner.model';
import {
  EditTrainingManagerModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-training-manager-modal/edit-training-manager-modal.component";
import {IKeyValuePair, ILTEvent} from "../../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  EditCourseCompletionModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-course-completion-modal/edit-course-completion-modal.component";
import {DeferredResource} from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  EditExternalSKUModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-external-sku-modal/edit-external-sku-modal.component";
import {
  EditSelfRegistrationModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-self-registration-modal/edit-self-registration-modal.component";
import {
  AssignUsersModalComponent
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/assign-users-modal/assign-users-modal.component";
import {EnvironmentService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services/common";
import {AdminCoursesService} from "../../../../../../../../../../../libs/shared/src/lib/utils/services";

@Component({
  selector: 'leap-sp-course-variant-details',
  templateUrl: './sp-course-variant-details.component.html',
  styleUrls: ['./sp-course-variant-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpCourseVariantDetailsComponent implements OnInit {
  @Select(SpCourseVariantDetailsState.spCourseLanguageVariant)
  spCourseLanguageVariant$: Observable<DeferredResource<SPCourseLanguageVariant>>;

  courseId: string;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly modalService: NzModalService,
    private readonly adminCourseService: AdminCoursesService,
    public readonly environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const variantId = paramMap.get('variantId');
      this.courseId = paramMap.get('id');
      this.store.dispatch([new GetSPCourseLanguageVariant({ id: variantId })]);
    });
  }

  onSelectTab(activeTab: number): void {
    this.store.dispatch(new ChangeSPCourseLanguageVariantDetailsTab({ activeTab }));
  }

  onEditDetails(property: string, languageVariant: SPCourseLanguageVariant): void {
    switch (property) {
      case 'trainingManager':
        this.updateTrainingManager(languageVariant);
        break;
      case 'selfRegistration':
        this.updateSelfRegistration('Edit Self Registration', languageVariant);
        break;
      case 'registrationApproval':
        this.updateSelfRegistration('Edit Registration Approval', languageVariant);
        break;
      case 'courseCompletion':
        this.updateCourseCompletion(languageVariant);
        break;
      case 'external-sku':
        this.updateExternalSKU(languageVariant);
        break;
      default:
        throw new Error('Unknown property');
    }
  }

  updateTrainingManager(languageVariant: SPCourseLanguageVariant): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Training Manager',
      nzContent: EditTrainingManagerModalComponent,
      nzComponentParams: {
        selectedTrainingManager: languageVariant.trainingManagers?.[0],
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
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const { trainingManagers } = data.form.getRawValue();
            const updatedLanguageVariant = produce(languageVariant, (draft: Draft<SPCourseLanguageVariant>) => {
              draft.trainingManagers = trainingManagers;
            });

            return this.store
              .dispatch(
                new UpdateSPCourseLanguageVariantAttribute({
                  updatedLanguageVariant,
                  attribute: 'training-manager',
                  props: ['trainingManagers'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateSelfRegistration(title: string, languageVariant: SPCourseLanguageVariant): void {
    const {
      selfRegistration,
      course: { automaticApproval },
    } = languageVariant;

    const modal: NzModalRef = this.modalService.create({
      nzTitle: title,
      nzContent: EditSelfRegistrationModalComponent,
      nzComponentParams: {
        selfRegistration,
        automaticApproval,
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
          disabled: (d) => d.form.invalid,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedLanguageVariant = produce(languageVariant, (draft: Draft<SPCourseLanguageVariant>) => {
              draft.selfRegistration = formValue.selfRegistration;
              draft.course.automaticApproval = formValue.automaticApproval;
            });

            return this.store
              .dispatch(
                new UpdateSPCourseLanguageVariantAttribute({
                  updatedLanguageVariant,
                  attribute: 'self-registration',
                  props: ['selfRegistration', 'course.automaticApproval'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateCourseCompletion(languageVariant: SPCourseLanguageVariant): void {
    const { automaticCourseCompletion } = languageVariant;

    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Course Completion',
      nzContent: EditCourseCompletionModalComponent,
      nzComponentParams: {
        automaticCourseCompletion,
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
          disabled: (d) => d.form.invalid,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedLanguageVariant = produce(languageVariant, (draft: Draft<SPCourseLanguageVariant>) => {
              draft.automaticCourseCompletion = formValue.automaticCourseCompletion;
            });

            return this.store
              .dispatch(
                new UpdateSPCourseLanguageVariantAttribute({
                  updatedLanguageVariant,
                  attribute: 'completion',
                  props: ['automaticCourseCompletion'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateExternalSKU(languageVariant: SPCourseLanguageVariant): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: languageVariant.course.specificExternalSKU
        ? 'Edit Custom Course Code'
        : 'Edit Internal Course Code / SKU',
      nzContent: EditExternalSKUModalComponent,
      nzComponentParams: {
        mainLabel: languageVariant.course.specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
        subLabel: languageVariant.course.specificExternalSKU
          ? 'Please enter a code between 4 to 8 characters containing only digits and alphabets in upper case.'
          : 'Edit the Internal Course Code / SKU',
        initVal: languageVariant.course.externalSKU,
        pattern: languageVariant.course.specificExternalSKU ? /^[A-Z0-9]+$/i : undefined,
        minLength: languageVariant.course.specificExternalSKU ? 4 : undefined,
        maxLength: languageVariant.course.specificExternalSKU ? 8 : undefined,
        specificExternalSKU: languageVariant.course.specificExternalSKU,
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
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedLanguageVariant = produce(languageVariant, (draft: Draft<ILTEvent>) => {
              draft.course.externalSKU = formValue.externalSKU || null;
            });

            return this.store
              .dispatch(
                new UpdateSPCourseLanguageVariantAttribute({
                  updatedLanguageVariant,
                  attribute: 'external-sku',
                  props: ['course'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  onAssignUsers(languageVariant: SPCourseLanguageVariant): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Assign Users',
      nzContent: AssignUsersModalComponent,
      nzWrapClassName: 'modal-class',
      nzComponentParams: {
        data: languageVariant,
      },
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'text',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => d.validateLearners,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const learnersList = data.bulkLearners
              ? ((data.bulkLearners as unknown) as SPCourseLanguageVariantLearner[]).map((learner) => learner.username)
              : [...(formValue.lxpUsers ?? []), ...(formValue.emailUsers ?? [])];
            return this.adminCourseService
              .validateLearnerSession(data.data.course.parentId, learnersList)
              .pipe(
                map((items: IKeyValuePair[]) => items.filter((item) => !item.value).map((item) => item.key)),
                switchMap((invalidUsers) => {
                  if (invalidUsers.length === 0) {
                    return data.bulkLearners
                      ? this.store.dispatch([
                          new UploadLearnersFromCSVToLanguageVariant({
                            languageVariantId: languageVariant.id,
                            data: data.bulkLearners as SPCourseLanguageVariantLearner[],
                          }),
                        ])
                      : this.store.dispatch([
                          new AssignLearnersToLanguageVariant({
                            languageVariantId: languageVariant.id,
                            data: [...formValue.lxpUsers, ...formValue.emailUsers],
                          }),
                        ]);
                  } else {
                    data.setErrorMessage(invalidUsers);
                    return of(null);
                  }
                }),
              )
              .toPromise()
              .then((_) => {
                if (_) {
                  modal.destroy();
                  this.store.dispatch([
                    new GetSPCourseLanguageVariantLearnersEnrolled({ id: languageVariant.classEvent.id }),
                    new GetSPCourseLanguageVariantExams({ id: languageVariant.id }),
                  ]);
                }
              });
          },
        },
      ],
    });
  }
}
