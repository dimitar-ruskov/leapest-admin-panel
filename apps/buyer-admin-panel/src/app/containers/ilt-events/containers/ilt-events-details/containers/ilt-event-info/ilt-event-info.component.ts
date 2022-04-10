import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { EventInfoEditHandlerService } from '../../../../services/event-info-edit-handler.service';

import {
  CertificateInfo,
  FlattenedCourseDetails,
  ILTEvent,
  InternalRepositoryDTO
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  CertificatePreviewComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/feature/certificate-preview/certificate-preview.component";
import {DownloadSphinxService} from "../../../../../../../../../../libs/shared/src/lib/utils/services/common";

@Component({
  selector: 'leap-ilt-event-info',
  templateUrl: './ilt-event-info.component.html',
  styleUrls: ['./ilt-event-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltEventInfoComponent {
  @Input() iltEvent: ILTEvent;
  constructor(
    private readonly modalService: NzModalService,
    private readonly downloadSphinxService: DownloadSphinxService,
    private readonly eventInfoEditHandlerService: EventInfoEditHandlerService,
  ) {}

  getInstructorMaterials(course: FlattenedCourseDetails): InternalRepositoryDTO[] {
    const arr = [...course.masterInternalRepositories, ...course.additionalMasterInternalRepositories];
    return arr.filter((m) => m.userType.configKey === 'instructor').map((m) => m.defaultVariant);
  }

  getLearnerMaterials(course: FlattenedCourseDetails): InternalRepositoryDTO[] {
    const arr = [...course.masterInternalRepositories, ...course.additionalMasterInternalRepositories];
    return arr.filter((m) => m.userType.configKey === 'learner').map((m) => m.defaultVariant);
  }

  onEditEventDetailsProp(fieldId: string, iltEvent: ILTEvent): void {
    this.eventInfoEditHandlerService.editProperty(fieldId, iltEvent);
  }

  onUploadThumbnail({ thumbnailUrl, courseId }: { thumbnailUrl: string; courseId: string }): void {
    this.eventInfoEditHandlerService.uploadThumbnail(thumbnailUrl, courseId);
  }

  onGenerateThumbnail({ iltEventId }: { iltEventId: string }): void {
    this.eventInfoEditHandlerService.generateThumbnail(iltEventId);
  }

  public downloadCertificate(certificate: CertificateInfo): void {
    const link = this.downloadSphinxService.getSphinxUrl(certificate.s3Bucket, certificate.s3Key);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  public previewCertificate(certificate: CertificateInfo): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Template Preview',
      nzContent: CertificatePreviewComponent,
      nzComponentParams: {
        s3Bucket: certificate.s3Bucket,
        s3Key: certificate.s3Key,
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
          onClick: () => this.downloadCertificate(certificate),
        },
      ],
    });
  }
}
