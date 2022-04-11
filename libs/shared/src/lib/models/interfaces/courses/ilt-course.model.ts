import { InternalRepositoryMaterial } from '../internal-repo/internal-repository.model';
import { ITrainingManager } from './ilt-event.model';
import {IKeyValuePair} from "../common/dictionary.model";
import {ConfigDto} from "../common/config-dto.model";
import {Certificate} from "../certificates/ceritificate.model";
import {IDomainData} from "../domain-data.model";

export interface ILTCourseAgendaDaySection {
  description?: string;
  duration?: number;
  endDateTime?: string;
  startDateTime?: string;
  title?: string;
  type?: ConfigDto;
  id?: string;
}

export interface ILTCourseAgendaDay {
  endDateTime?: string;
  startDateTime?: string;
  items: ILTCourseAgendaDaySection[];
  externalMeetingEnabled?: boolean;
  meeting?: { joinURL: string };
  isEditable?: boolean;
}

export interface ILTCourseAgenda {
  days: ILTCourseAgendaDay[];
}

export interface ExpressCourse {
  language: ConfigDto;
  description?: string;
  maxSeats?: number;
  minStudents?: number;
  existingMaterials?: InternalRepositoryMaterial[];
  categoryCode?: string;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryCode?: string;
  subcategoryName?: string;
  level?: ConfigDto;
  keywords?: string[];
  agenda?: ILTCourseAgendaDay[];
  agendaEditable?: boolean;
  courseAvailable?: boolean;
  objectives?: string;
  targetAudience?: string;
  selfRegistration?: boolean;
  trainingManagerId?: string;
  trainingManagerEmail?: string;
  trainingManagerName?: string;
  trainingManagers?: ITrainingManager[];
  automaticApproval?: boolean;
  externalSKU?: string;
  lxpPrivate?: boolean;
  lxpRestrictUsers?: string[];
  lxpRestrictGroups?: { key: string; value: string }[];
  lxpChannels?: IKeyValuePair[];
  lxpGroups?: IKeyValuePair[];
}

export interface ILTCourse {
  expressCourse: ExpressCourse;
  name: string;
  isInternal: boolean;
  format: ConfigDto;
  id?: string;
  tab?: string;
  createdBy?: string;
  participationCertificate?: Certificate;
  automaticPublishToLxp?: boolean;
}

export interface ILTCourseCategory {
  id: string;
  name: string;
  code: string;
}

export interface CourseReviews {
  count: number;
  data: {
    id: string;
    courseEvent: any;
    createdAt: string;
    updatedAt?: string;
    createdBy: string;
    updatedBy?: string;
    message?: string;
    reviewer?: any;
    rating: number;
    anonymous: boolean;
    status: any;
  };
  limit: number;
  page: number;
  metadata: any;
}

export interface PublishCourseToLXP {
  code: string;
  domain: string;
  lxpPrivate: boolean;
  lxpRestrictUsers: string[];
  lxpRestrictGroups: IKeyValuePair[];
  groups?: IKeyValuePair[];
  channels?: IKeyValuePair[];
  externalSKU?: string;
}

export interface PublishedILTCourse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  agenda: ILTCourseAgendaDaySection[];
  materials?: any;
  thumbnailKey: string;
  thumbnailUrl: string;
  hasCustomImage: boolean;
  bannerKey?: any;
  promotionMaterials: any[];
  promotionLinks: any[];
  code: string;
  sku: string;
  externalSKU: string;
  name: string;
  format: ConfigDto;
  keywords: string[];
  description: string;
  categoryName: string;
  categoryId: string;
  objectives: string;
  targetAudience: string;
  subcategoryName: string;
  subcategoryCode: string;
  topic: any[];
  status?: any;
  maxSeats: number;
  minStudents: number;
  waitingListSize?: number;
  waitingList?: boolean;
  automaticApproval?: any;
  availableForCourseCreation: boolean;
  online?: boolean;
  level: ConfigDto;
  agendaEditable: boolean;
  hierarchicalAgenda: ILTCourseAgendaDay[];
  thumbnailProcess: boolean;
  thumbnailBucket: string;
  language: ConfigDto;
  editLock: boolean;
  domain: IDomainData;
  defaultSubDomain: string;
  parentThumbnailUrl?: any;
  brandedPortalMaterials?: any;
  parentId?: any;
  parentSku?: any;
  durationInHours: number;
  durationInDays: number;
  isInternal: boolean;
  pricing?: any;
  agoraProducts: any[];
  onlineDelivery?: any;
  registrationApprovalRequired?: any;
  categoryCode: string;
  agoraProductSegmentCode?: any;
  agoraProductSegmentValue?: any;
  agoraProductSegmentNonEditable?: any;
  participationCertificate?: Certificate;
  examCompletionAvailable: boolean;
  masterInternalRepositories: InternalRepositoryMaterial[];
  root: boolean;
  activeEventsCount?: any;
  totalEventsCount: number;
  archived?: boolean;
  deletable?: boolean;
  averageRating?: number;
  totalNumberOfReviews?: number;
  cancellationPolicy?: any;
  lxpEnabledDomain: boolean;
  publishStatus?: ConfigDto;
  lxpPrivate?: boolean;
  lxpRestrictUsers?: string[];
  lxpRestrictGroups?: { key: string; value: string }[];
  additionalMasterInternalRepositories: InternalRepositoryMaterial[];
  marketplaceMaterials: InternalRepositoryMaterial[];
  enrollmentPolicy?: ConfigDto;
  specificExternalSKU?: boolean;
}

export interface DraftILTCourse {
  id: string;
  name: string;
  format: ConfigDto;
  status: ConfigDto;
  code?: any;
  type: ConfigDto;
  isInternal: boolean;
  createdBy: string;
  accountName: string;
}

export interface PreILTCourse {
  expressCourse: ExpressCourse;
  name: string;
  isInternal: boolean;
  format: ConfigDto;
  id?: string;
  tab?: string;
  createdBy?: string;
  participationCertificate?: Certificate;
  specificExternalSKU: boolean;
}

export interface PublishedCourseToLXP {
  id: string;
  code: string;
  domain: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  groups: string[];
  channels: string[];
}

export interface InternalRepositories {
  learner: InternalRepositoryMaterial[];
  instructor: InternalRepositoryMaterial[];
}
