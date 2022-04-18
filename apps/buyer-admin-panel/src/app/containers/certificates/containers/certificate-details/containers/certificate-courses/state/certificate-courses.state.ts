import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import {
  CertificatesService
} from "../../../../../../../../../../../libs/shared/src/lib/services/certificates/certificates.service";
import {
  ChangeCertCoursesPaginationParams,
  GetCertificateCourses,
  ResetCertificateCoursesState
} from "./certificate-courses.actions";

import {
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  DraftILTCourse,
  IPageable
} from "../../../../../../../../../../../libs/shared/src/lib/models";
import { DeferredResource } from "../../../../../../../../../../../libs/shared/src/lib/utils/common";

export class CertificateCoursesStateModel {
  courses: DraftILTCourse[] | null;
  loading: boolean;
  total: number;
  paginationParams: IPageable;
}

@State<CertificateCoursesStateModel>({
  name: 'certificateCourses',
  defaults: {
    courses: null,
    loading: false,
    total: 0,
    paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  },
  children: [],
})
@Injectable()
export class CertificateCoursesState {
  constructor(private readonly service: CertificatesService) {}

  @Selector([CertificateCoursesState])
  static courses(state: CertificateCoursesStateModel) {
    return state.courses;
  }

  @Selector([CertificateCoursesState])
  static loading(state: CertificateCoursesStateModel) {
    return state.loading;
  }

  @Selector([CertificateCoursesState])
  static total(state: CertificateCoursesStateModel) {
    return state.total;
  }

  @Selector([CertificateCoursesState])
  static searchPhrase(state: CertificateCoursesStateModel) {
    return state.paginationParams.filter;
  }

  @Selector([CertificateCoursesState])
  static pageIndex(state: CertificateCoursesStateModel) {
    return state.paginationParams.page;
  }

  @Selector([CertificateCoursesState])
  static pageSize(state: CertificateCoursesStateModel) {
    return state.paginationParams.limit;
  }

  @Action(GetCertificateCourses)
  getCertificates({ patchState, getState }: StateContext<CertificateCoursesStateModel>, action: GetCertificateCourses) {
    const { certificateId } = action.payload;
    const { paginationParams } = getState();

    return this.service.getCertificateCourses(certificateId, paginationParams).pipe(
      tap((resource: DeferredResource<{ data: DraftILTCourse[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ courses: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeCertCoursesPaginationParams)
  changeCertCoursesPaginationParams(
    { patchState, getState }: StateContext<CertificateCoursesStateModel>,
    { payload }: ChangeCertCoursesPaginationParams,
  ) {
    const { paginationParams } = getState();

    patchState({ paginationParams: { ...paginationParams, ...payload.pageable } });
  }

  @Action(ResetCertificateCoursesState)
  resetCoursesListState({ patchState }: StateContext<CertificateCoursesStateModel>) {
    patchState({
      loading: false,
      courses: [],
      total: 0,
      paginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
