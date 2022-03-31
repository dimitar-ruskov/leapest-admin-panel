import { InternalRepositoryMaterial } from '../internal-repository.model';
import { ConfigDto } from './config-dto.model';
import { Certificate } from '../../common/common-course/models/course.model';
import { IKeyValuePair } from '../../core/model/dictionary.model';
import { ITrainingManager } from './ilt-event.model';

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
