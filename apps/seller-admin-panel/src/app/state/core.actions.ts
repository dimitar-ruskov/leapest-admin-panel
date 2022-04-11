import {IDomainData} from "../../../../../libs/shared/src/lib/models/interfaces";

export class GetLearnerProfile {
  static readonly type = '[Core] Get Learner Profile';
  constructor() {}
}

export class SetDomainData {
  static readonly type = '[Core] Set Domain Data';
  constructor(public readonly data: IDomainData) {}
}

export class GetILTLanguageDictionary {
  static readonly type = '[Core] Get ILT Language Dictionary';
}

export class GetIRLanguageDictionary {
  static readonly type = '[Core] Get IR Language Dictionary';
}

export class GetCourseLevelDictionary {
  static readonly type = '[Core] Get Course Level Dictionary';
}

export class GetMaterialTypes {
  static readonly type = '[Core] Get Material Types';
}

export class GetCertificatesDictionary {
  static readonly type = '[Core] Get Certificates Dictionary';
}

export class GetConferencingToolsDictionary {
  static readonly type = '[Core] Get Conferencing Tools Dictionary';
}

export class GetCustomAttendanceDictionary {
  static readonly type = '[Core] Get Custom Attendance Dictionary';
}

export class GetIRTypeList {
  static readonly type = '[Core] Get IR Type List';
}

export class GetEnrollmentCauseTypeDictionary {
  static readonly type = '[Core] Get Enrollment Cause Type Dictionary';
}

export class GetUnenrollmentCauseTypeDictionary {
  static readonly type = '[Core] Get Unenrollment Cause Type Dictionary';
}

export class FetchTimezones {
  static readonly type = '[Core] Fetch Timezones';
  constructor() {}
}
