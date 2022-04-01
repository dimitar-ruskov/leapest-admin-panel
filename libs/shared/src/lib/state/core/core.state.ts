import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import {forkJoin} from "rxjs";
import {map, catchError, tap, filter} from 'rxjs/operators';
import { OktaAuthStateService } from '@okta/okta-angular';

import {
  AmberError,
  AmberResponse,
  IDomainData,
  IProfile,
  CoreService,
  AdminCoursesService,
  DeferredResource,
  IKeyValuePair,
  ILTEventCustomAttendanceLight,
  ConferencingTool,
  IConfigCertificatesDictionary
} from "@leapest-admin-panel/shared";
import {
  GetLearnerProfile,
  GetProfileSuccess,
  GetProfileFailure,
  SetDomainData,
  GetCourseLevelDictionary,
  GetCustomAttendanceDictionary,
  GetILTLanguageDictionary,
  GetIRLanguageDictionary, GetMaterialTypes, GetCertificatesDictionary, GetConferencingToolsDictionary,
} from './core.actions';

export class CoreStateModel {
  profile?: IProfile;
  getProfilePending: boolean;
  getProfileSuccess: boolean;
  getProfileError: AmberError;

  domainData: IDomainData;
  showNotSyncedUserModal: boolean;

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
    getProfileSuccess: false,
    getProfileError: undefined,

    domainData: undefined,
    showNotSyncedUserModal: false,

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
  getLearnerProfile({ patchState, dispatch }: StateContext<CoreStateModel>) {
    patchState({ getProfilePending: true, getProfileSuccess: false, getProfileError: undefined });
    return this.coreService.getLearnerProfile().pipe(
      map((_) => _.data),
      map((learner: IProfile) => {
        return dispatch(new GetProfileSuccess(learner));
      }),
      catchError((httpError: HttpErrorResponse) => {
        const error = (<AmberResponse<any>>httpError.error).error;
        return dispatch(new GetProfileFailure(error));
      }),
    );
  }

  @Action(GetProfileSuccess)
  getProfileSuccess({ patchState }: StateContext<CoreStateModel>, action: GetProfileSuccess) {
    patchState({
      getProfilePending: false,
      getProfileSuccess: true,
      getProfileError: undefined,
      profile: action.payload,
      showNotSyncedUserModal: false,
    });
  }

  @Action(GetProfileFailure)
  getProfileFailure({ patchState, getState }: StateContext<any>, action: GetProfileFailure) {
    patchState({
      ...getState(),
      getProfilePending: false,
      getProfileSuccess: false,
      getProfileError: action.payload,
      profile: undefined,
      showNotSyncedUserModal: true,
    });
  }

  @Action(SetDomainData)
  setDomainData({ getState, patchState }: StateContext<CoreStateModel>, { data }: SetDomainData) {
    if (this.titleService.getTitle() === 'Admin Panel') {
      this.titleService.setTitle(data['buyerName']);
    }

    patchState({ domainData: data });
  }

  @Action(GetILTLanguageDictionary)
  getILTLanguageDictionary({ patchState, getState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getILTLanguageDictionary().pipe(
      tap((res: DeferredResource<IKeyValuePair[]>) => {
        if (res.isSuccess) {
          patchState({ iltLanguageDictionary: res.response });
        }
      }),
    );
  }

  @Action(GetIRLanguageDictionary)
  getIRLanguageDictionary({ patchState, getState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getIRLanguageDictionary().pipe(
      tap((res) => {
        if (res.isSuccess) {
          patchState({ internalRepositoryLanguages: res.response.data });
        }
      }),
    );
  }

  @Action(GetCourseLevelDictionary)
  getCourseLevelDictionary({ patchState, getState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getCourseLevelDictionary().pipe(
      map((t) => t.data),
      tap((courseLevelDictionary: IKeyValuePair[]) => {
        patchState({ courseLevelDictionary });
      }),
    );
  }

  @Action(GetMaterialTypes)
  getMaterialTypes({ patchState, getState }: StateContext<CoreStateModel>) {
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
  getCertificatesDictionary({ patchState, getState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getCertificatesList().pipe(
      map((t) => t.response),
      tap((certificatesDictionary: IConfigCertificatesDictionary[]) => {
        patchState({ certificatesDictionary });
      }),
    );
  }

  @Action(GetConferencingToolsDictionary)
  getConferencingToolsDictionary({ patchState, getState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getConferencingToolsDictionary().pipe(
      filter((r) => r.isSuccess),
      map((t) => t.response),
      tap((conferencingTools: ConferencingTool[]) => {
        patchState({ conferencingToolsDictionary: conferencingTools });
      }),
    );
  }

  @Action(GetCustomAttendanceDictionary)
  getCustomAttendanceDictionary({ patchState, getState }: StateContext<CoreStateModel>) {
    return this.adminCoursesService.getCustomAttendanceDictionary().pipe(
      filter((r) => r.isSuccess),
      map((t) => t.response),
      tap((customAttendanceDictionary: ILTEventCustomAttendanceLight[]) => {
        patchState({ customAttendanceDictionary: customAttendanceDictionary });
      }),
    );
  }
}
