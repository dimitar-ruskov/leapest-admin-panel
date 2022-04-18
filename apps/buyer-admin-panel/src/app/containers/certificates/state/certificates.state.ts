import { Injectable } from "@angular/core";
import { State } from "@ngxs/store";
import { CertificatesListState } from "../containers/certificates-list/state/certificates-list.state";
import {
  CertificateCoursesState
} from "../containers/certificate-details/containers/certificate-courses/state/certificate-courses.state";
import { CertificateDetailsState } from "../containers/certificate-details/state/certificate-details.state";
import {
  CertificateIssuedState
} from "../containers/certificate-details/containers/certificate-issued/state/certificate-issued.state";

@State({
  name: 'certificates',
  children: [
    CertificatesListState,
    CertificateCoursesState,
    CertificateDetailsState,
    CertificateIssuedState
  ]
})
@Injectable()
export class CertificatesState {}
