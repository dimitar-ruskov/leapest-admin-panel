import {IPageable} from "../../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetIssuedCertificates {
  static readonly type = '[Issued Certificates] Get Issued Certificates';
  constructor(public readonly payload: { certificateId: string }) {}
}

export class ChangeIssuedCertificatesPaginationParams {
  static readonly type = '[Issued Certificates] Change Issued Certificates Pagination Params';
  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetIssuedCertificatesState {
  static readonly type = '[Issued Certificates] Reset Issued Certificates State';
}
