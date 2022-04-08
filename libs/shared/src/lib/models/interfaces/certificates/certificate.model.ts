import {ILTInstructor} from "../courses/ilt-event.model";
import {S3Resource} from "../common/s3-resource.model";
import {ILTEventAttendanceStatus} from "../courses/ilt-event-attendance.model";

export interface Certificate extends CreateCourseModel {
  id: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  createdByUser: ILTInstructor;
  updatedByUser: ILTInstructor;
  sku: string;
  type?: string | null;
  status: ILTEventAttendanceStatus;
}

export interface CreateCourseModel extends S3Resource {
  fileName: string;
  displayName: string;
  validityPeriod: number;
}

export interface UploadTemplateResp {
  key: string;
  bucket: string;
  progress?: number;
  type?: string;
  response?: {
    participantsNameValid: true;
  };
}

export interface GeneralCertificate {
  awsBucket: string;
  awsKey: string;
  expirationDate: string;
  id: string;
  participateName: string;
  sku: string;
}
