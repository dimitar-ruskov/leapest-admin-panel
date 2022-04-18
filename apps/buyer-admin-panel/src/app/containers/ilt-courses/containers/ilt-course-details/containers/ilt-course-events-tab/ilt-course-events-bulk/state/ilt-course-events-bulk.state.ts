import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";

import {
  ChangeEventUploadsPaginationParams,
  ChangeReportTab,
  ChangeSchedulingReportPaginationParams,
  CourseEventsBulkUploadsSchedulingReportByType,
  CourseEventsBulkUploadsSchedulingSummary,
  CourseEventsBulkUploadsValidationReport,
  CourseEventsCsvUploadsList,
  ResetCourseEventsCsvUploadsListState,
  ResetSchedulingReportState
} from "./ilt-course-events-bulk.actions";

import { DeferredResource } from "../../../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  IltCourseEventsBulkService
} from "../../../../../../../../../../../../libs/shared/src/lib/services/events/ilt-course-events-bulk.service";
import {
  BulkUploadsSchedulingSummary,
  BulkUploadsValidationReport,
  CourseEventsBulkUploads,
  DEFAULT_INITIAL_PAGINATION_PARAMS,
  IPageable,
  PublishingReportByStatus
} from "../../../../../../../../../../../../libs/shared/src/lib/models";


export class IltCourseEventsBulkUploadsStateModel {
  bulkUploads: CourseEventsBulkUploads[] | null;
  loading: boolean;
  total: number;
  uploadsPaginationParams: IPageable;
  validationReport: BulkUploadsValidationReport;
  schedulingSummary: BulkUploadsSchedulingSummary;
  schedulingSummaryLoading: boolean;
  schedulingReport: any;
  schedulingPaginationParams: IPageable;
  activeTab: number;
}

const defaults = {
  bulkUploads: undefined,
  loading: undefined,
  total: undefined,
  uploadsPaginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  validationReport: undefined,
  schedulingSummary: undefined,
  schedulingSummaryLoading: undefined,
  schedulingReport: undefined,
  schedulingPaginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
  activeTab: 0,
};

@State<IltCourseEventsBulkUploadsStateModel>({
  name: 'iltCourseEventsBulkUploads',
  defaults,
})
@Injectable()
export class IltCourseEventsBulkUploadsState {
  constructor(private readonly store: Store, private readonly service: IltCourseEventsBulkService) {}

  @Selector([IltCourseEventsBulkUploadsState])
  static bulkUploads(state: IltCourseEventsBulkUploadsStateModel) {
    return state.bulkUploads;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static validationReport(state: IltCourseEventsBulkUploadsStateModel) {
    return state.validationReport;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static schedulingSummary(state: IltCourseEventsBulkUploadsStateModel) {
    return state.schedulingSummary;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static schedulingSummaryLoading(state: IltCourseEventsBulkUploadsStateModel) {
    return state.schedulingSummaryLoading;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static activeTab(state: IltCourseEventsBulkUploadsStateModel) {
    return state.activeTab;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static schedulingReport(state: IltCourseEventsBulkUploadsStateModel) {
    return state.schedulingReport;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static loading(state: IltCourseEventsBulkUploadsStateModel) {
    return state.loading;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static total(state: IltCourseEventsBulkUploadsStateModel) {
    return state.total;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static pageIndex(state: IltCourseEventsBulkUploadsStateModel) {
    return state.uploadsPaginationParams.page;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static pageSize(state: IltCourseEventsBulkUploadsStateModel) {
    return state.uploadsPaginationParams.limit;
  }

  @Selector([IltCourseEventsBulkUploadsState])
  static schedulingPageIndex(state: IltCourseEventsBulkUploadsStateModel) {
    return state.schedulingPaginationParams.page;
  }

  @Action(CourseEventsCsvUploadsList)
  fetchCsvUploads(
    { getState, patchState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    action: CourseEventsCsvUploadsList,
  ) {
    const { courseSku } = action.payload;
    const { uploadsPaginationParams } = getState();

    return this.service.listUploads(courseSku, uploadsPaginationParams).pipe(
      tap((resource: DeferredResource<{ data: CourseEventsBulkUploads[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ bulkUploads: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeEventUploadsPaginationParams)
  changeEventUploadsPaginationParams(
    { patchState, getState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    { payload }: ChangeEventUploadsPaginationParams,
  ) {
    const { uploadsPaginationParams } = getState();

    patchState({ uploadsPaginationParams: { ...uploadsPaginationParams, ...payload.pageable } });
  }

  @Action(CourseEventsBulkUploadsValidationReport)
  getValidationReport(
    { patchState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    action: CourseEventsBulkUploadsValidationReport,
  ) {
    return this.service.getValidationReport(action.csvId).pipe(
      tap((resource: DeferredResource<BulkUploadsValidationReport>) => {
        patchState({ validationReport: resource.response });
      }),
    );
  }

  @Action(ChangeReportTab)
  changeReportTab(
    { patchState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    { payload: { activeTab } }: ChangeReportTab,
  ) {
    patchState({ activeTab });
  }

  @Action(CourseEventsBulkUploadsSchedulingSummary)
  getSchedulingSummary(
    { patchState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    action: CourseEventsBulkUploadsSchedulingSummary,
  ) {
    return this.service.getSchedulingSummary(action.csvId).pipe(
      tap((resource: DeferredResource<BulkUploadsSchedulingSummary>) => {
        patchState({ schedulingSummaryLoading: resource.isPending });
        if (resource.isSuccess) {
          patchState({ schedulingSummary: resource.response });
        }
      }),
    );
  }

  @Action(CourseEventsBulkUploadsSchedulingReportByType)
  getCourseEventsBulkUploadsSchedulingReportByType(
    { patchState, getState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    { payload }: CourseEventsBulkUploadsSchedulingReportByType,
  ) {
    const { schedulingPaginationParams } = getState();
    const { status, csvId } = payload;

    return this.service.getSchedulingReport(status, csvId, schedulingPaginationParams).pipe(
      tap((resource: DeferredResource<{ data: PublishingReportByStatus[]; flags: { size: number } }>) => {
        patchState({ loading: resource.isPending });

        if (resource.isSuccess) {
          patchState({ schedulingReport: resource.response.data, total: resource.response.flags.size });
        }
      }),
    );
  }

  @Action(ChangeSchedulingReportPaginationParams)
  changeSchedulingReportPaginationParams(
    { patchState, getState }: StateContext<IltCourseEventsBulkUploadsStateModel>,
    { payload }: ChangeSchedulingReportPaginationParams,
  ) {
    const { schedulingPaginationParams } = getState();

    patchState({ schedulingPaginationParams: { ...schedulingPaginationParams, ...payload.pageable } });
  }

  @Action(ResetSchedulingReportState)
  resetSchedulingReportState({ patchState }: StateContext<IltCourseEventsBulkUploadsStateModel>) {
    patchState({
      schedulingReport: [],
      total: 0,
      schedulingPaginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }

  @Action(ResetCourseEventsCsvUploadsListState)
  resetCourseEventsCsvUploadsListState({ patchState }: StateContext<IltCourseEventsBulkUploadsStateModel>) {
    patchState({
      bulkUploads: [],
      total: 0,
      uploadsPaginationParams: DEFAULT_INITIAL_PAGINATION_PARAMS,
    });
  }
}
