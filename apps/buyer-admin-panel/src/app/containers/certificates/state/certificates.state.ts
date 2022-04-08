import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import {CertificatesListState} from "./certificates-list/certificates-list.state";
import {CertificateCoursesState} from "./certificates-details/certificate-courses.state";
import {CertificateDetailsState} from "./certificates-details/certificate-details.state";
import {CertificateIssuedState} from "./certificates-details/certificate-issued.state";

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
