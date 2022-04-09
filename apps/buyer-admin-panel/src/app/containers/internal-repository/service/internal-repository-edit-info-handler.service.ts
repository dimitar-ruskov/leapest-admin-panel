import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  UpdateAssessmentDetails,
  UpdateParentInternalRepository,
} from '../containers/internal-repository-details/state/internal-repository-details.actions';
import * as moment from 'moment';
import {
  EditPassRateModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-pass-rate-modal/edit-pass-rate-modal.component";
import {GeneralInfoField, InternalRepository} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  EditInternalRepoNameModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-internal-repo-name-modal/edit-internal-repo-name-modal.component";
import {DEFAULT_QUILL_EDITOR_CONFIG} from "../../../../../../../libs/shared/src/lib/models/constants";
import {
  QuillInputModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/quill-input-modal/quill-input-modal.component";

@Injectable({
  providedIn: 'root',
})
export class InternalRepositoryEditInfoHandlerService {
  constructor(private readonly modalService: NzModalService, private readonly store: Store) {}

  prepareGeneralInfoFields(internalRepository: InternalRepository): GeneralInfoField[] {
    const fields: GeneralInfoField[] = [
      {
        id: 'name',
        title: 'Display Name',
        value: {
          content: internalRepository.name,
          styles: { fontSize: '20px' },
        },
        editable: true,
      },
      {
        id: 'type',
        title: 'Type',
        value: {
          content: internalRepository.type.configValue,
        },
        editable: false,
      },
      {
        id: 'lastUpdate',
        title: 'Last Update',
        value: {
          content: moment(internalRepository.lastUpdated).format('D MMM YYYY, HH:mm'),
        },
        editable: false,
      },
      {
        id: 'lastUpdateBy',
        title: 'Last Update By',
        value: {
          content: internalRepository.updatedBy,
        },
        editable: false,
      },
      {
        id: 'description',
        title: 'Description',
        value: {
          content: internalRepository.description,
          contentType: 'html',
        },
        editable: true,
      },
    ];
    const additionalExemFields = [
      {
        id: 'questions',
        title: 'Number of questions',
        value: {
          content: internalRepository.assessmentDetails?.questions,
        },
        editable: false,
      },
      {
        id: 'duration',
        title: 'Duration',
        value: {
          content: internalRepository.assessmentDetails?.duration,
        },
        editable: false,
      },
      {
        id: 'instructions',
        title: 'Text instructions',
        value: {
          content: internalRepository.assessmentDetails?.instructions,
        },
        editable: false,
      },
      {
        id: 'passRate',
        title: 'Pass rate',
        value: {
          content: `${internalRepository.assessmentDetails?.passRate} %`,
        },
        editable: true,
      },
    ];
    if (internalRepository.assessmentDetails) {
      return [...fields, ...additionalExemFields];
    } else {
      return fields;
    }
  }

  editProperty(fieldId: string, ir: InternalRepository): void {
    switch (fieldId) {
      case 'name':
        this.editIRName(ir);
        break;

      case 'description':
        this.editIRDescription(ir);
        break;

      case 'passRate':
        this.editIRPassRate(ir);
        break;

      default:
        throw new Error('Wrong field id');
    }
  }

  editIRName(ir: InternalRepository): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Material Name',
      nzContent: EditInternalRepoNameModalComponent,
      nzComponentParams: {
        mainLabel: 'Display Name',
        subLabel: 'This is the name displayed to Learners on the Branded Portal.',
        initVal: ir.name,
        type: { key: ir.type.configKey, value: ir.type.configValue },
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
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            return this.store
              .dispatch(
                new UpdateParentInternalRepository({
                  internalRepository: { ...ir, name: formValue.textInput },
                  key: 'name',
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editIRPassRate(ir: InternalRepository) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Pass rate',
      nzContent: EditPassRateModalComponent,
      nzComponentParams: {
        mainLabel: 'Pass rate',
        subLabel:
          'This information is shown to Learners on the Learning Portal and will determine whether the user has passed the exam.',
        initVal: ir.assessmentDetails.passRate,
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
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            return this.store
              .dispatch(
                new UpdateAssessmentDetails({
                  internalRepository: {
                    ...ir,
                    assessmentDetails: { ...ir.assessmentDetails, passRate: formValue.numberInput },
                  },
                  key: 'passRate',
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editIRDescription(ir: InternalRepository) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Material Description',
      nzContent: QuillInputModalComponent,
      nzComponentParams: {
        mainLabel: 'Description',
        subLabel:
          'This description is shown to Learners on the Branded Portal, to explain them what this material is used for.',
        initVal: ir.description,
        quillConfig: DEFAULT_QUILL_EDITOR_CONFIG,
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
          disabled: (d) => !d.form.valid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            return this.store
              .dispatch(
                new UpdateParentInternalRepository({
                  internalRepository: { ...ir, description: formValue.quillInput },
                  key: 'description',
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }
}
