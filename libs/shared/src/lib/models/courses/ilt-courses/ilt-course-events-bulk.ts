export interface UploadCourseEventsCsv {
  courseSku: string;
  fileName: string;
  s3Bucket: string;
  s3Key: string;
}

export interface CourseEventsBulkUploads {
  createdAt: string;
  csvType: string;
  errorMessage: string;
  fileName: string;
  id: number;
  numbersOfEvents?: number;
  path: string;
  s3Bucket: string;
  s3Key: string;
  separator: string;
  status: BulkUploadsStatus;
  strategy?: string;
  totalRows: number;
  totalValidRows: number;
  courseSku: string;
}

export interface BulkUploadsStatus {
  configKey: string;
  configOrder: string;
  configType: string;
  configValue: string;
  id: number;
  systemConfig: boolean;
}

export interface BulkUploadsValidationReport {
  createdAt: string;
  csvBucket: string;
  csvKey: string;
  errors: BulkUploadsValidationReportErrors[];
  fileName: string;
  id: number;
  numberOfBrokenRows: number;
  totalRows: number;
  validatedRows: number;
  warnings: number;
}

export interface BulkUploadsValidationReportErrors {
  columnName: string;
  errorCode: string;
  errorMessage: string;
  errorType: string;
  rows: number[];
}

export interface BulkUploadsSchedulingSummary {
  createdAt: string;
  createdCourseEvents: number;
  failedCourseEvents: number;
  pendingCourseEvents: number;
  sellerCsvId: number;
  totalNumberOfCourseEvents: number;
}

export interface PublishingReportByStatus {
  courseEventDate: string;
  courseEventExternalSku: string;
  courseEventId: number;
  error: string;
  status: BulkUploadsStatus;
  umbrellaId: number;
  venue: string;
}
