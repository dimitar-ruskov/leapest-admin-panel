import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CertificateDetailsState } from './state/certificate-details.state';
import { GetCertificateDetails } from './state/certificate-details.actions';

import { Certificate } from '../../../../../../../../libs/shared/src/lib/models/interfaces/certificates/certificate.model';
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";

@Component({
  selector: 'leap-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateDetailsComponent implements OnInit {
  @Select(CertificateDetailsState.certificate)
  certificate$: Observable<DeferredResource<Certificate>>;

  private id: string;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');
      this.store.dispatch([new GetCertificateDetails(this.id)]);
    });
  }
}
