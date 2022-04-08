import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { CertificatesService } from '../../service/certificates.service';
import {
  ChangeCertificatesPaginationParams,
  GetCertificates,
  ResetCertificatesState,
} from './certificates-list.actions';

import { Certificate } from '../../../../../../../../libs/shared/src/lib/models/interfaces/certificates/certificate.model';
import {DeferredResource} from "../../../../../../../../libs/shared/src/lib/utils/common";
import {DEFAULT_INITIAL_PAGINATION_PARAMS} from "../../../../../../../../libs/shared/src/lib/models/constants";
import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class CertificatesListStateModel {
  loading: boolean;
  certificates: Certificate[];
  total: number;
  paginationParams: IPageable;
}
@State<CertificatesListStateModel>({
  name: 'certificatesList',
  defaults: {
    loading: false,
    certificates: [],
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
})
@Injectable()
export class CertificatesListState {
  @Selector()
  static loading(state: CertificatesListStateModel) {
    return state.loading;
  }

  @Selector()
  static certificates(state: CertificatesListStateModel) {
    return state.certificates;
  }

  @Selector()
  static total(state: CertificatesListStateModel) {
    return state.total;
  }

  @Selector()
  static searchPhrase(state: CertificatesListStateModel) {
    return state.paginationParams.filter;
  }

  @Selector()
  static pageIndex(state: CertificatesListStateModel) {
    return state.paginationParams.page;
  }

  @Selector()
  static pageSize(state: CertificatesListStateModel) {
    return state.paginationParams.limit;
  }

  constructor(private readonly certificatesService: CertificatesService) {}

  @Action(GetCertificates)
  getCertificates({ patchState, getState }: StateContext<CertificatesListStateModel>) {
    const { paginationParams } = getState();

    return this.certificatesService.getCertificates(paginationParams).pipe(
      tap((resource: DeferredResource<{ data: Certificate[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ certificates: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeCertificatesPaginationParams)
  changeCertificatesPaginationParams(
    { patchState, getState }: StateContext<CertificatesListStateModel>,
    { payload }: ChangeCertificatesPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetCertificatesState)
  resetCertificatesState({ patchState }: StateContext<CertificatesListStateModel>) {
    patchState({
      loading: false,
      certificates: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
