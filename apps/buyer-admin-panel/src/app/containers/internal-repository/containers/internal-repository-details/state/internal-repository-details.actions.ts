import {InternalRepository} from "../../../../../../../../../libs/shared/src/lib/models";

export class GetInternalRepositoryDetails {
  static readonly type = '[Internal Repository Details] Get Internal Repository Details';
  constructor(public readonly payload: string) {}
}

export class UpdateParentInternalRepository {
  static readonly type = '[Internal Repository Details] Update Parent Internal Repository';
  constructor(public readonly payload: { internalRepository: InternalRepository; key: string }) {}
}

export class UpdateAssessmentDetails {
  static readonly type = '[Assessment Details] Update Assessment Details';
  constructor(public readonly payload: { internalRepository: InternalRepository; key: string }) {}
}
