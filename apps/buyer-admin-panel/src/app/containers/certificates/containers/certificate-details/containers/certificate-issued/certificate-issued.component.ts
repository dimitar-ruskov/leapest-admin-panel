import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

import { CertificateIssuedState } from './state/certificate-issued.state';
import {
  ChangeIssuedCertificatesPaginationParams,
  GetIssuedCertificates,
  ResetIssuedCertificatesState,
} from './state/certificate-issued.actions';

import { GeneralCertificate, IPageable } from '../../../../../../../../../../libs/shared/src/lib/models';
import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  CertificatePreviewComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/feature/certificate-preview/certificate-preview.component";
import {
  DownloadSphinxService
} from "../../../../../../../../../../libs/shared/src/lib/services/common/download-sphinx.service";

const NO_CERTIFICATES_TEXT = 'No certificates issued';

@Component({
  selector: 'leap-certificate-issued',
  templateUrl: './certificate-issued.component.html',
  styleUrls: ['./certificate-issued.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateIssuedComponent implements OnInit {
  noResultsText = NO_CERTIFICATES_TEXT;

  @Select(CertificateIssuedState.certificates)
  certificates$: Observable<DeferredResource<GeneralCertificate[]>>;

  @Select(CertificateIssuedState.loading)
  loading$: Observable<boolean>;

  @Select(CertificateIssuedState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(CertificateIssuedState.pageSize)
  pageSize$: Observable<number>;

  @Select(CertificateIssuedState.total)
  total$: Observable<number>;

  @Select(CertificateIssuedState.pageIndex)
  pageIndex$: Observable<number>;

  public certificateId: string;

  trackByFn: TrackByFunction<GeneralCertificate> = (index, item) => item.id;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly modalService: NzModalService,
    private readonly downloadSphinxService: DownloadSphinxService,
  ) {}

  ngOnInit(): void {
    this.certificateId = this.route.snapshot.paramMap.get('id');
    this.store.dispatch([new ResetIssuedCertificatesState()]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable: IPageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([
      new ChangeIssuedCertificatesPaginationParams({ pageable }),
      new GetIssuedCertificates({ certificateId: this.certificateId }),
    ]);
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeIssuedCertificatesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetIssuedCertificates({ certificateId: this.certificateId }),
    ]);
  }

  public downloadCertificate(s3Bucket: string, s3Key: string): void {
    const link = this.downloadSphinxService.getSphinxUrl(s3Bucket, s3Key);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  public previewCertificate(s3Bucket: string, s3Key: string): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Template Preview',
      nzContent: CertificatePreviewComponent,
      nzComponentParams: {
        s3Bucket: s3Bucket,
        s3Key: s3Key,
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
          onClick: () => this.downloadCertificate(s3Bucket, s3Key),
        },
      ],
    });
  }

  formatDate(dt: string): string {
    return dt ? moment(dt).format('DD MMM YYYY') : 'Does not expire';
  }

  onPreviewClicked(): void {}
}
