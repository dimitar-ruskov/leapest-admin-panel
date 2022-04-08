import {IPageable} from "../../../../../../../../libs/shared/src/lib/models/interfaces";

export class GetCertificates {
  static readonly type = '[Certificates List] Get Certificates';
}

export class ChangeCertificatesPaginationParams {
  static readonly type = '[Certificates List] Change Certificates Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetCertificatesState {
  static readonly type = '[Certificates List] Reset Certificates State';
}
