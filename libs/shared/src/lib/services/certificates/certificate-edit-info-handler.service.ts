import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import * as moment from "moment";

import {
  UpdateCertificateFields
} from "../../../../../../apps/buyer-admin-panel/src/app/containers/certificates/containers/certificate-details/state/certificate-details.actions";
import {
  EditCertificatePeriodComponent
} from "../../components/modals/edit-certificate-period/edit-certificate-period.component";
import {
  CertificateUploadFileComponent
} from "../../components/feature/certificate-upload-file/certificate-upload-file.component";

import { Certificate, GeneralInfoField } from "../../models";
import { TextInputModalComponent } from "../../components/modals/text-input-modal/text-input-modal.component";

@Injectable({
  providedIn: 'root'
})
export class CertificateEditInfoHandlerService {
  constructor(private readonly modalService: NzModalService, private readonly store: Store) {}

  private getUserName(user?): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  private getValidityPeriod(validityPeriod?: number): string {
    if (validityPeriod) {
      return validityPeriod.toString() + (validityPeriod === 1 ? ' Month' : ' Months');
    }
    return 'N/A';
  }

  prepareGeneralInfoFields(certificate: Certificate): GeneralInfoField[] {
    return [
      {
        id: 'displayName',
        title: 'CERTIFICATE TEMPLATE NAME',
        value: {
          content: certificate.displayName,
        },
        editable: true,
      },
      {
        id: 'validityPeriod',
        title: 'VALIDITY PERIOD',
        value: {
          content: this.getValidityPeriod(certificate.validityPeriod),
        },
        editable: true,
      },
      {
        id: 'createdAt',
        title: 'CREATION DATE',
        value: {
          content: moment(certificate.createdAt).format('DD MMM YYYY, [at] HH:mm A zzz'),
        },
        editable: false,
      },
      {
        id: 'createdBy',
        title: 'CREATED BY',
        value: {
          contentType: 'user',
          content: [
            {
              name: this.getUserName(certificate.createdByUser),
              email: certificate.createdBy,
            },
          ],
        },
        editable: false,
      },
      {
        id: 'updatedAt',
        title: 'LAST UPDATE',
        value: {
          content: moment(certificate.updatedAt).format('DD MMM YYYY, [at] HH:mm A zzz'),
        },
        editable: false,
      },
      {
        id: 'lastUpdateBy',
        title: 'LAST UPDATED BY',
        value: {
          contentType: 'user',
          content: [
            {
              name: this.getUserName(certificate.updatedByUser),
              email: certificate.updatedBy,
            },
          ],
        },
        editable: false,
      },
      {
        id: 'certificate',
        title: 'CERTIFICATE TEMPLATE FILE',
        value: {
          contentType: 'certificate',
          content: {
            value: certificate.fileName,
            s3Bucket: certificate.s3Bucket,
            s3Key: certificate.s3Key,
            preview: true,
            enabled: true,
          },
        },
        editable: true,
      },
    ];
  }

  editProperty(fieldId: string, certificate: Certificate): void {
    switch (fieldId) {
      case 'displayName':
        this.editCertificateName(certificate);
        break;

      case 'validityPeriod':
        this.editCertValidityPeriod(certificate);
        break;

      case 'certificate':
        this.editCertificateFile(certificate);
        break;

      default:
        throw new Error('Wrong field id');
    }
  }

  private editCertificateName(certificate: Certificate): void {
    const nzComponentParams = {
      mainLabel: 'Certificate Template Name',
      subLabel: 'Used to identify this template, and as the basis of the file name sent to the Learner.',
      initVal: certificate.displayName,
      modalExplanation:
        'Please be aware that any changes to this information will only be reflected in future courses issuing this' +
        ' certificate. No changes will be done to already released certificates.',
    };
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Certificate Template Name',
      nzContent: TextInputModalComponent,
      nzComponentParams,
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
                new UpdateCertificateFields({
                  certificate: { ...certificate, displayName: formValue.textInput },
                  key: 'displayName',
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editCertValidityPeriod(certificate: Certificate): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Certificate Template Validity',
      nzContent: EditCertificatePeriodComponent,
      nzComponentParams: {
        initVal: certificate.validityPeriod,
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
                new UpdateCertificateFields({
                  certificate: {
                    ...certificate,
                    validityPeriod: formValue.agree ? 0 : formValue.validityPeriod,
                  },
                  key: 'validityPeriod',
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  private editCertificateFile(certificate: Certificate): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Certificate Template File',
      nzContent: CertificateUploadFileComponent,
      nzComponentParams: {
        displayLabel: true,
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
          disabled: (d) => !d.validFile,
          onClick: async (data) => {
            return this.store
              .dispatch(
                new UpdateCertificateFields({
                  certificate: {
                    ...certificate,
                    fileName: data.uploadedFile.name,
                    s3Bucket: data.s3Bucket,
                    s3Key: data.s3Key,
                  },
                  key: 'template',
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
