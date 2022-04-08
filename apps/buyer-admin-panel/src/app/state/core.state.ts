import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import {forkJoin} from "rxjs";
import {map, tap, filter} from 'rxjs/operators';
import { OktaAuthStateService } from '@okta/okta-angular';

import {DeferredResource} from "../../../../../libs/shared/src/lib/utils/common";
import {CoreService} from "../../../../../libs/shared/src/lib/utils/services/common";
import {AdminCoursesService} from "../../../../../libs/shared/src/lib/utils/services";
import {
  ConferencingTool,
  IConfigCertificatesDictionary,
  IDomainData,
  IKeyValuePair,
  ILTEventCustomAttendanceLight, IProfile
} from "../../../../../libs/shared/src/lib/models/interfaces";
import {
  GetLearnerProfile,
  SetDomainData,
  GetCourseLevelDictionary,
  GetCustomAttendanceDictionary,
  GetILTLanguageDictionary,
  GetIRLanguageDictionary,
  GetMaterialTypes,
  GetCertificatesDictionary,
  GetConferencingToolsDictionary,
} from './core.actions';

export class CoreStateModel {
  profile: IProfile;
  getProfilePending: boolean;
  domainData: IDomainData;

  iltLanguageDictionary: IKeyValuePair[];
  courseLevelDictionary: IKeyValuePair[];
  iltMaterialTypes: IKeyValuePair[];
  iltMaterialExternalTypes: IKeyValuePair[];
  internalRepositoryLanguages: IKeyValuePair[];
  certificatesDictionary: IConfigCertificatesDictionary[];
  conferencingToolsDictionary: ConferencingTool[];
  customAttendanceDictionary: ILTEventCustomAttendanceLight[];
}

@State<CoreStateModel>({
  name: 'core',
  defaults: {
    profile: undefined,
    getProfilePending: false,
    domainData: undefined,

    iltLanguageDictionary: [],
    courseLevelDictionary: [],
    iltMaterialTypes: [],
    iltMaterialExternalTypes: [],
    internalRepositoryLanguages: [],
    certificatesDictionary: [],
    conferencingToolsDictionary: [],
    customAttendanceDictionary: [],
  },
})
@Injectable()
export class CoreState implements NgxsOnInit {
  constructor(
    private readonly coreService: CoreService,
    private readonly titleService: Title,
    private readonly oktaAuthStateService: OktaAuthStateService,
    // @TODO move dictionaries to CoreService
    private readonly adminCoursesService: AdminCoursesService
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
}
