import { Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";
import { Action, NgxsOnInit, State, StateContext } from "@ngxs/store";
import { forkJoin } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { OktaAuthStateService } from "@okta/okta-angular";
import { NzTableFilterList } from "ng-zorro-antd/table";

import { DeferredResource } from "../../../../../libs/shared/src/lib/utils/common";
import {
  ConferencingTool,
  ICauseType,
  IConfigCertificatesDictionary,
  IDomainData,
  IKeyValuePair,
  ILTEventCustomAttendanceLight,
  IProfile
} from "../../../../../libs/shared/src/lib/models";
import {
  FetchTimezones,
  GetCertificatesDictionary,
  GetConferencingToolsDictionary,
  GetCourseLevelDictionary,
  GetCustomAttendanceDictionary,
  GetEnrollmentCauseTypeDictionary,
  GetILTLanguageDictionary,
  GetIRLanguageDictionary,
  GetIRTypeList,
  GetLearnerProfile,
  GetMaterialTypes,
  GetUnenrollmentCauseTypeDictionary,
  SetDomainData
} from "./core.actions";
import { TimezoneService } from "../../../../../libs/shared/src/lib/services/common/timezone.service";
import { CoreService } from "../../../../../libs/shared/src/lib/services/common/core.service";
import { AdminCoursesService } from "../../../../../libs/shared/src/lib/services/events/admin-courses.service";

export class CoreStateModel {
  profile: IProfile;
  getProfilePending: boolean;
  domainData: IDomainData;

  timezones: IKeyValuePair[];
  iltLanguageDictionary: IKeyValuePair[];
  courseLevelDictionary: IKeyValuePair[];
  iltMaterialTypes: IKeyValuePair[];
  iltMaterialExternalTypes: IKeyValuePair[];
  internalRepositoryLanguages: IKeyValuePair[];
  internalRepositoryTypes: IKeyValuePair[];
  certificatesDictionary: IConfigCertificatesDictionary[];
  conferencingToolsDictionary: ConferencingTool[];
  customAttendanceDictionary: ILTEventCustomAttendanceLight[];
  enrollmentCauseTypes: NzTableFilterList[];
  unenrollmentCauseTypes: NzTableFilterList[];
}

@State<CoreStateModel>({
  name: 'core',
  defaults: {
    profile: undefined,
    getProfilePending: false,
    domainData: undefined,

    timezones: [],
    iltLanguageDictionary: [],
    courseLevelDictionary: [],
    iltMaterialTypes: [],
    iltMaterialExternalTypes: [],
    internalRepositoryLanguages: [],
    internalRepositoryTypes: [],
    certificatesDictionary: [],
    conferencingToolsDictionary: [],
    customAttendanceDictionary: [],
    enrollmentCauseTypes: [],
    unenrollmentCauseTypes: [],
  },
})
@Injectable()
export class CoreState implements NgxsOnInit {
  constructor(
    private readonly coreService: CoreService,
    private readonly titleService: Title,
    private readonly oktaAuthStateService: OktaAuthStateService,
    // @TODO move dictionaries to CoreService
    private readonly adminCoursesService: AdminCoursesService,
    private readonly timezoneService: TimezoneService
  ) {}

  async ngxsOnInit(ctx: StateContext<CoreStateModel>) {
    const accessToken = (await this.oktaAuthStateService['oktaAuth'].tokenManager?.get('accessToken'))?.accessToken;
    if (accessToken) {
      ctx.dispatch(new GetLearnerProfile());
    }
  }

  @Action(GetLearnerProfile)
  getLearnerProfile({ patchState }: StateContext<CoreStateModel>) {
    patchState({ getProfilePending: true });
    return this.coreService.getLearnerProfile().pipe(
      filter((response) => !response.error),
      map((response) => response.data),
      map((learner: IProfile) => {
        patchState({ profile: learner, getProfilePending: false });
      }),
    );
  }

  @Action(SetDomainData)
  setDomainData({ patchState }: StateContext<CoreStateModel>, { data }: SetDomainData) {
    if (this.titleService.getTitle() === 'Admin Panel') {
      this.titleService.setTitle(data['buyerName']);
    }

    patchState({ domainData: data });
  }

  @Action(FetchTimezones)
  fetchTimezones({ patchState }: StateContext<CoreStateModel>) {
    return this.timezoneService.getTimezoneDictionary().pipe(
      tap((res: DeferredResource<IKeyValuePair[]>) => {
        if (res.isSuccess) {
          patchState({ timezones: res.response });
        }
      }),
    );
  }

  @Action(GetILTLanguageDictionary)
  getILTLanguageDictionary({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getILTLanguageDictionary().pipe(
      tap((res: DeferredResource<IKeyValuePair[]>) => {
        if (res.isSuccess) {
          patchState({ iltLanguageDictionary: res.response });
        }
      }),
    );
  }

  @Action(GetIRLanguageDictionary)
  getIRLanguageDictionary({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getIRLanguageDictionary().pipe(
      tap((res) => {
        if (res.isSuccess) {
          patchState({ internalRepositoryLanguages: res.response.data });
        }
      }),
    );
  }

  @Action(GetCourseLevelDictionary)
  getCourseLevelDictionary({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getCourseLevelDictionary().pipe(
      map((t) => t.data),
      tap((courseLevelDictionary: IKeyValuePair[]) => {
        patchState({ courseLevelDictionary });
      }),
    );
  }

  @Action(GetMaterialTypes)
  getMaterialTypes({ patchState }: StateContext<CoreStateModel>) {
    return forkJoin([
      this.adminCoursesService.getMaterialTypes(true),
      this.adminCoursesService.getMaterialTypes(false),
    ]).pipe(
      tap((res: DeferredResource<IKeyValuePair[]>[]) => {
        if (res[0].isSuccess && res[1].isSuccess) {
          patchState({ iltMaterialTypes: res[0].response, iltMaterialExternalTypes: res[1].response });
        }
      }),
    );
  }

  @Action(GetCertificatesDictionary)
  getCertificatesDictionary({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getCertificatesList().pipe(
      map((t) => t.response),
      tap((certificatesDictionary: IConfigCertificatesDictionary[]) => {
        patchState({ certificatesDictionary });
      }),
    );
  }

  @Action(GetConferencingToolsDictionary)
  getConferencingToolsDictionary({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getConferencingToolsDictionary().pipe(
      filter((r) => r.isSuccess),
      map((t) => t.response),
      tap((conferencingTools: ConferencingTool[]) => {
        patchState({ conferencingToolsDictionary: conferencingTools });
      }),
    );
  }

  @Action(GetCustomAttendanceDictionary)
  getCustomAttendanceDictionary({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getCustomAttendanceDictionary().pipe(
      filter((r) => r.isSuccess),
      map((t) => t.response),
      tap((customAttendanceDictionary: ILTEventCustomAttendanceLight[]) => {
        patchState({ customAttendanceDictionary: customAttendanceDictionary });
      }),
    );
  }

  @Action(GetIRTypeList)
  getIRTypeList({ patchState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getIRDictionary('internalRepositorySettingsType').pipe(
      tap((res) => {
        if (res.isSuccess) {
          const data = res.response.data.filter((type: IKeyValuePair) => type.key !== 'globalSettings');
          patchState({ internalRepositoryTypes: data });
        }
      }),
    );
  }

  @Action(GetEnrollmentCauseTypeDictionary)
  getEnrollmentCauseTypeDictionary({ patchState }) {
    return this.adminCoursesService.getCauseTypeDictionary('enrollment-cause').pipe(
      map((t) => t.data),
      tap((res: ICauseType[]) => {
        const enrollmentCauseTypes = res.map((item) => ({ text: item.configValue, value: item.configKey }));
        patchState({ enrollmentCauseTypes });
      }),
    );
  }

  @Action(GetUnenrollmentCauseTypeDictionary)
  getUnnrollmentCauseTypeDictionary({ patchState }) {
    return this.adminCoursesService.getCauseTypeDictionary('unenrollment-cause').pipe(
      map((t) => t.data),
      tap((res: ICauseType[]) => {
        const unenrollmentCauseTypes = res.map((item) => ({ text: item.configValue, value: item.configKey }));
        patchState({ unenrollmentCauseTypes });
      }),
    );
  }
}
