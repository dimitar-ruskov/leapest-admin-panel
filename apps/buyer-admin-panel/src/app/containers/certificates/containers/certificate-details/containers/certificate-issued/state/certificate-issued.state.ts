import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";

import {
  CertificatesService
} from "../../../../../../../../../../../libs/shared/src/lib/services/certificates/certificates.service";
import {
  ChangeIssuedCertificatesPaginationParams,
  GetIssuedCertificates,
  ResetIssuedCertificatesState
} from "./certificate-issued.actions";

import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  GeneralCertificate,
  IPageable
} from "../../../../../../../../../../../libs/shared/src/lib/models";

export class CertificateIssuedStateModel {
  certificates: GeneralCertificate[] | null;
  loading: boolean;
  total: number;
  paginationParams: IPageable;
}
@State<CertificateIssuedStateModel>({
  name: 'certificateIssued',
  defaults: {
    certificates: null,
    loading: false,
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
  children: [],
})
@Injectable()
export class CertificateIssuedState {
  constructor(private readonly service: CertificatesService) {}

  @Selector([CertificateIssuedState])
  static certificates(state: CertificateIssuedStateModel) {
    return state.certificates;
  }

  @Selector([CertificateIssuedState])
  static loading(state: CertificateIssuedStateModel) {
    return state.loading;
  }

  @Selector([CertificateIssuedState])
  static total(state: CertificateIssuedStateModel) {
    return state.total;
  }

  @Selector([CertificateIssuedState])
  static searchPhrase(state: CertificateIssuedStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([CertificateIssuedState])
  static pageIndex(state: CertificateIssuedStateModel) {
    return state.paginationParams.page;
  }

  @Selector([CertificateIssuedState])
  static pageSize(state: CertificateIssuedStateModel) {
    return state.paginationParams.limit;
  }

  @Action(GetIssuedCertificates)
  getCertificates({ patchState, getState }: StateContext<CertificateIssuedStateModel>, action: GetIssuedCertificates) {
    const { certificateId } = action.payload;
    const { paginationParams } = getState();

    return this.service.getCertificateIssued(certificateId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: GeneralCertificate[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ certificates: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeIssuedCertificatesPaginationParams)
  changeIssuedCertificatesPaginationParams(
    { patchState, getState }: StateContext<CertificateIssuedStateModel>,
    { payload }: ChangeIssuedCertificatesPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetIssuedCertificatesState)
  resetIssuedCertificatesListState({ patchState }: StateContext<CertificateIssuedStateModel>) {
    patchState({
      loading: false,
      certificates: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
