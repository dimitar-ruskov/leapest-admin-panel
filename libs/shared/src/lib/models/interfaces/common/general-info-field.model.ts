import {InternalRepositoryDTO} from "../feature/internal-repository.model";
import {PublishedILTCourse} from "../feature/courses/ilt-course.model";

export interface InfoField {
  id: string;
  title: string;
  value: GeneralInfoFieldValue | MaterialsInfoFieldValue;
  editable?: boolean;
}

export interface GeneralInfoUser {
  name: string;
  email: string;
}

export interface CertificateInfo {
  value: string;
  delete?: boolean;
  preview?: boolean;
  s3Bucket?: string;
  s3Key?: string;
  parentId?: string;
  enabled?: boolean;
  course?: PublishedILTCourse;
}

export interface GeneralInfoFieldValue {
  contentType?: 'text' | 'html' | 'user' | 'certificate';
  content: CertificateInfo | string | GeneralInfoUser[] | number;
  description?: string;
  styles?: { [key: string]: string };
}

export interface GeneralInfoField extends InfoField {
  value: GeneralInfoFieldValue;
}

export interface MaterialsFieldContent {
  materials: InternalRepositoryDTO[];
  noMaterialsLabel: string;
}

export interface MaterialsInfoFieldValue {
  content: MaterialsFieldContent;
  contentType?: 'materials';
}

export interface MaterialsInfoField extends InfoField {
  value: MaterialsInfoFieldValue;
}
