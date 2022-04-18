import {IPageable} from "../../../../../../../../../../../../libs/shared/src/lib/models";

export class CourseEventsCsvUploadsList {
  static readonly type = '[AP ILT Course Events Bulk Upload] Course Events CSV Uploads Listing';
  constructor(public readonly payload: { courseSku: string }) {}
}

export class ChangeEventUploadsPaginationParams {
  static readonly type = '[AP ILT Course Events Bulk Upload] Change Course Events Bulk Uploads Pagination Params';
  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class CourseEventsBulkUploadsValidationReport {
  static readonly type = '[AP ILT Course Events Bulk Upload] Course Events Bulk Uploads Validation Report';
  constructor(public readonly csvId: string) {}
}

export class CourseEventsBulkUploadsScheduleEvent {
  static readonly type = '[AP ILT Course Events Bulk Upload] Course Events Bulk Uploads Schedule Event';
  constructor(public readonly payload: { id: string }) {}
}

export class ChangeReportTab {
  static readonly type = 'AP ILT Course Events Bulk Upload] Change Report Tab';
  constructor(public readonly payload: { activeTab: number }) {}
}

export class CourseEventsBulkUploadsSchedulingSummary {
  static readonly type = '[AP ILT Course Events Bulk Upload] Course Events Bulk Uploads Scheduling Summary';
  constructor(public readonly csvId: number) {}
}

export class CourseEventsBulkUploadsSchedulingReportByType {
  static readonly type = '[AP ILT Course Events Bulk Upload Scheduling Report] Bulk Upload Scheduling Report By Type';
  constructor(public readonly payload: { status: string; csvId: number }) {}
}

export class ChangeSchedulingReportPaginationParams {
  static readonly type =
    '[AP ILT Course Events Bulk Upload Scheduling Report] Change Course Events Bulk Uploads Scheduling Report Pagination Params';

  constructor(public readonly payload: { pageable: IPageable }) {}
}

export class ResetSchedulingReportState {
  static readonly type =
    '[AP ILT Course Events Bulk Upload Scheduling Report] Reset Bulk Upload Scheduling Report State';
}

export class ResetCourseEventsCsvUploadsListState {
  static readonly type = '[AP ILT Course Events Bulk Upload] Course Events Bulk Upload List State';
}
