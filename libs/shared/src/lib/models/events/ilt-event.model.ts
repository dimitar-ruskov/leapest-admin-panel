import { ILTCourseAgendaDay } from '../courses/ilt-courses/ilt-course.model';
import { InternalRepositoryMaterial } from '../internal-repo/internal-repository.model';
import { Venue } from './ilt-course-list-item';
import {ConfigDto} from "../common/config-dto.model";
import { ExportLearnersTypes } from "./ilt-event-learners.model";
import { Certificate } from "../certificates/certificate.model";

export class AssignLearnersResponse {
  username: string;
  courseEventId: string;
  message: string;
  enrolledLearners: number;
  remainingSeats: number;
  waitListedLearners?: number;
  remainingWaitlistSeats?: number;
  userLock: boolean;
}

export interface MaterialCompletionReport {
  completedContents: number;
  email: string;
  fullName?: string;
  totalContents: number;
  totalTime: number;
  userStarted: boolean;
}

export interface ExamCompletionReport {
  user: { username: string; firstName: string; lastName: string };
  status: string;
  startTime: string;
  performanceCategory: string;
  totalMarks: number;
  maxMarks: number;
  pdfReport?: string;
}

export interface ILTEventLearner {
  id: string;
  enrolmentDate: string;
  username: string;
  firstName: string;
  lastName: string;
  completionPercentage: number;
  eligibleForCompletion: boolean;
  displayName: string;
  enrollmentCause?: string;
  unenrollmentCause?: string;
}

export interface ILTEventUnenrolledLearner extends ILTEventLearner {
  unenrollmentDate: string;
}

export interface ExportLearnersDto {
  id: string;
  csvType: ExportLearnersTypes;
  statuses: ExportLearnersTypes[];
}

export interface APClassEvent {
  id?: string;
  learners?: any[];
  learnerCount?: number;
  timezone?: string;
  status?: ConfigDto;
  venue?: Venue;
  virtualVenue: boolean;
  startDate?: string;
  endDate?: string;
  classEnded?: boolean;
  pendingLearners?: number;
}

export interface ILTInstructor {
  id?: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  username: string;
}

export interface TrainingManager {
  firstName?: string;
  lastName?: string;
  email?: string;
  id?: string;
  employeeId?: string;
}

export interface ITrainingManager {
  trainingManagerEmail?: string;
  trainingManagerId?: string;
  trainingManagerName?: string;
}

export interface FlattenedCourseDetails {
  language: ConfigDto;
  description?: string;
  maxSeats?: number;
  minStudents?: number;
  masterInternalRepositories?: InternalRepositoryMaterial[];
  participationCertificate?: Certificate;
  categoryCode?: string;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  subcategoryCode?: string;
  level?: ConfigDto;
  keywords?: string[];
  agenda?: ILTCourseAgendaDay[];
  agendaEditable?: boolean;
  courseAvailable?: boolean;
  format?: ConfigDto;
  id?: string;
  parentId: string;
  name?: string;
  waitingList?: boolean;
  waitingListSize?: number;
  automaticApproval?: boolean;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  parentThumbnailUrl?: string;
  createdBy?: string;
  objectives?: string;
  targetAudience?: string;
  editLock?: boolean;
  hierarchicalAgenda?: ILTCourseAgendaDay[];
  externalSKU?: string;
  additionalMasterInternalRepositories?: InternalRepositoryMaterial[];
  marketplaceMaterials?: InternalRepositoryMaterial[];
  publishStatus?: ConfigDto;
  enrollmentPolicy?: ConfigDto;
  specificExternalSKU?: boolean;
  cancellationPolicy?: CancellationPolicy;
}

export interface CancellationPolicy {
  policyConfig: {
    configKey: string;
  };
}

export interface ILTEventBase {
  historical: boolean;
  isInternal: boolean;
  classEvent: { virtualVenue: boolean };
  course: {
    id: string;
    name?: string;
    publishStatus?: string;
    parentId?: string;
  };
}

export interface ILTEvent {
  id: string;
  course: FlattenedCourseDetails;
  isInternal: boolean;
  format: ConfigDto;
  tab?: string;
  cancellable: boolean;
  conferenceLink?: string;
  createdAt: string;
  csvBucket?: string;
  csvKey?: string;
  editLock: boolean;
  enrolledLearnerCounter: number;
  hierarchicalAgenda: ILTCourseAgendaDay[];
  historical: boolean;
  language: ConfigDto;
  learnerIsInstructor?: boolean;
  mandatoryAutomaticCourseCompletion?: boolean;
  publishEvent: boolean;
  registrationDeadline?: string;
  registrationDeadlineDependsOnEventStartDate: boolean;
  remainingSeats?: number;
  returnPeriodDependsOnEventStartDate: boolean;
  reviewsEnabled: boolean;
  selfRegistration: boolean;
  step?: string;
  trainingManagerEmail?: string;
  trainingManagerId?: string;
  trainingManagerName?: string;
  trainingManagers?: ITrainingManager[];
  userLock: boolean;
  waitingQueueLength: number;
  waitingQueueStatus?: ConfigDto;
  classEvent: APClassEvent;
  instructors?: ILTInstructor[];
  automaticCourseCompletion?: boolean;
  seatPurchaseOrigin: boolean;
  externalMeetingType?: string;
  automaticAttendanceCompletion?: boolean;
  automaticAttendanceTracking?: boolean;
  completionRate?: number;
  isInProgress: boolean;
  participationCertificateEnabled: boolean;
  automaticCancellation: boolean;
  automaticCancellationAllowed: boolean;
  sku: string;
}

export interface UploadLearnerResponse {
  csvReportList: any[];
  csvImportValid: boolean;
  remainingSeats: number;
  learners: ILTEventLearner[];
  numberofUsersInCsv: number;
}

export interface UploadFile {
  onProgress(percent: number): void;
  onError(event: Error): void;
  onSuccess(body: Record<string, unknown>, xhr?: Record<string, unknown>): void;
  data: Record<string, unknown>;
  filename: string;
  file: File;
  withCredentials: boolean;
  action: string;
  headers: Record<string, unknown>;
}

export interface LearnersBulkImportResponse {
  row: number;
  remarks: string[];
}

export interface LearnersValidationResponse {
  report: {
    [key: string]: string[];
  };
  isValid: boolean;
}

export interface EventReview {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  message?: string;
  rating: number;
  anonymous: boolean;
  status: any;
}
