import {ConfigDto} from "../common/config-dto.model";

export interface Assessment {
  createdOn: string;
  description: string;
  duration: number;
  id: number;
  instructions?: string;
  name: string;
  passRate?: number;
  questions: number;
}

export interface InternalRepository {
  assessmentDetails?: Assessment;
  deletable: boolean;
  description: string;
  lastUpdated: string;
  name: string;
  occurrenceCounter: number;
  sku: string;
  type: { configKey: string; configType: string; configValue: string };
  updatedBy: string;
  path: string;
}

export interface InternalRepositoryDTO {
  active?: boolean;
  domain?: string;
  id?: number;
  irDeliverableIds?: number[];
  language?: ConfigDto;
  name?: string;
  sku?: string;
  status?: ConfigDto;
  type?: ConfigDto;
  parentSKU?: string;
}

export interface InternalRepositoryMaterial {
  defaultVariant: InternalRepositoryDTO;
  defaultVariantSKU: string;
  internalRepositoryDTOs: InternalRepositoryDTO[];
  name: string;
  sku: string;
  type: ConfigDto;
  userType: ConfigDto;
  id: number;
  accessEndDate: string;
  accessStartDate: string;
  timezone: string;
  isExist?: boolean;
  isMarketplaceMaterial?: boolean;
  isAdditional?: boolean;
  indexNumber?: number;
}

export interface MasterInternalRepository {
  types: ConfigDto[];
  languages: ConfigDto[];
  id: number;
  sku: string;
  name: string;
  isExist?: boolean;
  defaultVariant?: InternalRepositoryDTO;
}

export interface ExamShortInfo {
  key: number;
  value: string;
}

export interface AssessmentDetails {
  id: number;
  name: string;
  description: string;
  duration: number;
  questions: number;
  createdOn: Date;
  language: string;
  passRate?: number;
}

export interface IRContent {
  id: number;
  contentId: number;
  contentTypeId: number;
  statusId: number;
  languageId: number;
  brandingLevelId?: any;
  printSpecificationId?: any;
  dynamicUrl?: any;
  contentName: string;
  name: string;
  fileName: string;
  path: string;
  pages?: any;
  version?: any;
  bucket?: any;
  key?: any;
  height?: any;
  width?: any;
  revision?: any;
  sourceRevision?: any;
  fileSize?: any;
  editionYear?: any;
  placeholders?: any;
  status: ConfigDto;
  contentType: ConfigDto;
  type: ConfigDto;
  printSpecification?: any;
  language: ConfigDto;
  brandingLevel?: any;
  active: boolean;
  deleted?: any;
  createdOn: number;
  createdBy: string;
  domain: string;
  materialVersion: number;
  fileNameFromPath?: any;
  s3PreviewContentKey?: any;
  presentationDTO?: any;
  action?: any;
  displayName: string;
  order?: any;
  externalID: string;
  renderedBucket?: any;
  renderedKey?: any;
  hosted: boolean;
  description: string;
  externalIDType?: any;
  consumptionStrategy?: any;
  assessmentDetails: AssessmentDetails;
  updatedAt: Date;
}

export interface IRCreatePayload {
  name: string;
  language: { configKey: string; configValue?: string };
  type: { configKey: string; configValue?: string };
  parentSKU?: string;
  sku?: string;
  mainDeliverables: any[];
  deliverableId?: number;
}

export interface IConfigType {
  configKey: string;
  configType?: string;
  configValue?: string;
}

export interface Contents {
  type: IConfigType;
  order: number;
}

export interface FormValue {
  type: { key: string };
  name: string;
  exam: string;
  externalLink: string;
  languages?: string;
  _contents?: Contents[];
}
