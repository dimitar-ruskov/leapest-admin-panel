import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { CertificatesListState } from './state/certificates-list.state';
import { CertificateCreateModalComponent } from '../../../../../../../../libs/shared/src/lib/components/modals/certificate-create-modal/certificate-create-modal.component';
import { CertificatesService } from '../../../../../../../../libs/shared/src/lib/services/certificates/certificates.service';
import {
  ChangeCertificatesPaginationParams,
  GetCertificates,
  ResetCertificatesState,
} from './state/certificates-list.actions';

import { Certificate } from '../../../../../../../../libs/shared/src/lib/models/certificates/certificate.model';
import {
  createPageableFromTableQueryParams,
  DeferredResource
} from "../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-certificates-list',
  templateUrl: './certificates-list.component.html',
  styleUrls: ['./certificates-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesListComponent implements OnInit {
  public guidelineLink = 'https://my.leapest.com/support?articleId=certificate-templates';

  @Select(CertificatesListState.loading)
  loading$: Observable<boolean>;

  @Select(CertificatesListState.searchPhrase)
  searchPhrase$: Observable<string>;

  @Select(CertificatesListState.certificates)
  certificates$: Observable<Certificate[]>;

  @Select(CertificatesListState.pageSize)
  pageSize$: Observable<number>;

  @Select(CertificatesListState.total)
  total$: Observable<number>;

  @Select(CertificatesListState.pageIndex)
  pageIndex$: Observable<number>;

  trackByFn: TrackByFunction<Certificate> = (index, item) => item.sku;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly service: CertificatesService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch([new ResetCertificatesState()]);
  }

  public getValidity(period: number): string {
    if (!period) {
      return 'No Expiration';
    }

    return period.toString() + (period === 1 ? ' Month' : ' Months');
  }

  public onSearchChange(searchPhrase: string): void {
    this.store.dispatch([
      new ChangeCertificatesPaginationParams({ pageable: { filter: searchPhrase, page: 1 } }),
      new GetCertificates(),
    ]);
  }

  public onQueryParamsChange(queryParams: NzTableQueryParams): void {
    const pageable = createPageableFromTableQueryParams(queryParams);

    this.store.dispatch([new ChangeCertificatesPaginationParams({ pageable }), new GetCertificates()]);
  }

  public formatDate(dt: string): string {
    if (!dt) {
      return 'N/A';
    } else {
      return moment(dt).format('D MMM YYYY, HH:MM A');
    }
  }

  public onCreateCertificate(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Create New Certificate Template',
      nzWidth: 660,
      nzContent: CertificateCreateModalComponent,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => !d.validCertificate,
          onClick: async (instance: CertificateCreateModalComponent) => {
            const { displayName, validityPeriod, agree } = instance.form.getRawValue();
            const body = {
              displayName,
              validityPeriod: agree ? 0 : validityPeriod,
              s3Key: instance.uploadComponent.s3Key,
              s3Bucket: instance.uploadComponent.s3Bucket,
              fileName: instance.uploadComponent.uploadedFile.name,
            };
            return this.service
              .createCertificateTemplate(body)
              .toPromise()
              .then((resp: DeferredResource<Certificate>) => {
                if (resp?.isSuccess) {
                  modal.destroy();
                  this.router.navigate(['admin', 'certificates', 'details', resp.response.id]);
                }
              });
          },
        },
      ],
    });
  }
}
