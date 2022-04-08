import { Certificate } from '../../../../../../../../libs/shared/src/lib/models/interfaces/certificates/certificate.model';

export class GetCertificateDetails {
  static readonly type = '[Certificate Details] Get Certificate Details';
  constructor(public readonly payload: string) {}
}

export class UpdateCertificateFields {
  static readonly type = '[Certificate Details] Update Certificate Fields';
  constructor(public readonly payload: { certificate: Certificate; key: string }) {}
}
