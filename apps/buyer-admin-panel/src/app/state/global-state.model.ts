import {CoreStateModel} from "./core.state";
import {CertificatesState} from "../containers/certificates/state/certificates.state";
import {CertificatesListState} from "../containers/certificates/state/certificates-list/certificates-list.state";
import {CertificateDetailsState} from "../containers/certificates/state/certificates-details/certificate-details.state";
import {CertificateCoursesState} from "../containers/certificates/state/certificates-details/certificate-courses.state";
import {CertificateIssuedState} from "../containers/certificates/state/certificates-details/certificate-issued.state";

export interface IGlobalStateModel {
  core: CoreStateModel;

  certificates: {
    certificatesList: CertificatesListState,
    certificateDetails: CertificateDetailsState,
    certificateCourses: CertificateCoursesState,
    certificateIssued: CertificateIssuedState
  }
}
