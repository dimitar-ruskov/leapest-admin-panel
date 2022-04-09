import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { CertificateDetailsState } from '../../state/certificate-details.state';
import { CertificateEditInfoHandlerService } from '../../../../service/certificate-edit-info-handler.service';

import { Certificate } from '../../../../../../../../../../libs/shared/src/lib/models/interfaces/certificates/certificate.model';
import {DeferredResource} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  CertificatePreviewComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/feature/certificate-preview/certificate-preview.component";
import {GeneralInfoField} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {DownloadSphinxService} from "../../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-certificate-details-info',
  templateUrl: './certificate-details-info.component.html',
  styleUrls: ['./certificate-details-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CertificateDetailsInfoComponent implements OnInit {
  @Select(CertificateDetailsState.certificate)
  certificate$: Observable<DeferredResource<Certificate>>;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly downloadSphinxService: DownloadSphinxService,
    private readonly modalService: NzModalService,
    private readonly certificateEditInfoHandlerService: CertificateEditInfoHandlerService,
  ) {}

  certificate: Certificate;
  fields: GeneralInfoField[];

  ngOnInit(): void {
    this.certificate$
      .pipe(
        filter((resource: DeferredResource<Certificate>) => !resource.isPending && !!resource.response),
        map((resource: DeferredResource<Certificate>) => resource.response),
        untilDestroyed(this),
      )
      .subscribe((certificate: Certificate) => {
        this.certificate = certificate;
        this.fields = this.certificateEditInfoHandlerService.prepareGeneralInfoFields(certificate);
        this.cdr.markForCheck();
      });
  }

  onEdit(fieldId: string): void {
    this.certificateEditInfoHandlerService.editProperty(fieldId, this.certificate);
  }

  public downloadCertificate(): void {
    const link = this.downloadSphinxService.getSphinxUrl(this.certificate.s3Bucket, this.certificate.s3Key);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  public previewCertificate(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Template Preview',
      nzContent: CertificatePreviewComponent,
      nzComponentParams: {
        s3Bucket: this.certificate.s3Bucket,
        s3Key: this.certificate.s3Key,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 900,
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Download',
          type: 'primary',
          onClick: () => this.downloadCertificate(),
        },
      ],
    });
  }
}
