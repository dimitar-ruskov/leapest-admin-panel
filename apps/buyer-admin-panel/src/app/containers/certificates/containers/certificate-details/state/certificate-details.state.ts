import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import produce from "immer";

import { GetCertificateDetails, UpdateCertificateFields } from "./certificate-details.actions";
import { CertificateCoursesState } from "../containers/certificate-courses/state/certificate-courses.state";
import { CertificateIssuedState } from "../containers/certificate-issued/state/certificate-issued.state";
import {
  CertificatesService
} from "../../../../../../../../../libs/shared/src/lib/services/certificates/certificates.service";

import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import { Certificate } from "../../../../../../../../../libs/shared/src/lib/models";


export class CertificateDetailsStateModel {
  certificate: DeferredResource<Certificate> | null;
}
@State<CertificateDetailsStateModel>({
  name: 'certificateDetails',
  defaults: {
    certificate: null,
  },
  children: [CertificateCoursesState, CertificateIssuedState],
})
@Injectable()
export class CertificateDetailsState {
  constructor(private readonly service: CertificatesService) {}

  @Selector([CertificateDetailsState])
  static certificate(state: CertificateDetailsStateModel) {
    return state.certificate;
  }

  @Action(GetCertificateDetails)
  getCertificateDetails({ patchState }: StateContext<CertificateDetailsStateModel>, action: GetCertificateDetails) {

    return this.service.getCertificateDetails(action.payload).pipe(
      tap((certificate: DeferredResource<Certificate>) => {
        patchState({ certificate });
      }),
    );
  }

  @Action(UpdateCertificateFields)
  updateCertificateFields(
    { patchState, getState }: StateContext<CertificateDetailsStateModel>,
    action: UpdateCertificateFields,
  ): Observable<DeferredResource<Certificate>> {
    const { certificate } = getState();
    const updatedCert = action.payload.certificate;
    const key = action.payload.key;
    return this.service.updateCertificateFields(updatedCert).pipe(
      tap((response: DeferredResource<Certificate>) => {
        if (response?.isSuccess) {
          let newCert;
          if (key === 'template') {
            newCert = produce(certificate.response, (cert: Certificate) => {
              cert.fileName = response.response.fileName;
              cert.s3Key = response.response.s3Key;
              cert.s3Bucket = response.response.s3Bucket;
            });
          } else {
            newCert = produce(certificate.response, (cert: Certificate) => {
              cert[key] = response.response[key];
            });
          }
          patchState({ certificate: DeferredResource.success(newCert) });
        }
      }),
    );
  }
}
