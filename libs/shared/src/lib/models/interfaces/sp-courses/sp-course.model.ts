import {
  SPCourseCreationStep
} from "../../../../../../../apps/buyer-admin-panel/src/app/containers/self-paced-courses/containers/sp-course-create/models/sp-course-create-step.model";
import {InternalRepositoryMaterial} from "../internal-repository.model";
import {ConfigDto} from "../common/config-dto.model";
import {ITrainingManager} from "../courses/ilt-event.model";
import {IDomainData} from "../domain-data.model";
import {ExpressCourse} from "../courses/ilt-course.model";

export interface SelfPacedCourseClassEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  name: string;
  displayName: string;
  selfPacedClass: boolean;
  startDate?: any;
  endDate?: any;
  virtualVenue: boolean;
  venue?: any;
  status: ConfigDto;
  releaseDate?: any;
  dateReleasedOn?: any;
  releasedManually?: any;
  timezone?: any;
  productGroups: any[];
  productGroupVoucherCount: any;
  products: any[];
  productVoucherCount: any;
  productVariants: any[];
  productVariantVoucherCount: any;
  instructors: any;
  instructorCount: number;
  learners: any[];
  learnerCount: number;
  learnerVoucherCount: any;
  exams: any;
  canSendInvitations: boolean;
  redirectLearnerEmails?: any;
  certificate?: any;
  type: ConfigDto;
  classEnded: boolean;
  typeString: string;
  newClass: boolean;
  domainName: string;
  defaultSubdomain: string;
  buyerId: string;
  pendingLearners?: any;
}

export interface DraftSelfPacedCourse {
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

export interface ActiveSelfPacedCourse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  agenda: any[];
  materials?: any;
  thumbnailKey: string;
  thumbnailUrl: string;
  hasCustomImage: boolean;
  bannerKey?: any;
  promotionMaterials: any[];
  promotionLinks: any[];
  code: string;
  sku: string;
  name: string;
  format: ConfigDto;
  keywords: string[];
  description: string;
  categoryName: string;
  categoryId: string;
  objectives?: any;
  targetAudience?: any;
  subcategoryId: string;
  subcategoryName: string;
  subcategoryCode: string;
  topic: any[];
  status?: any;
  maxSeats: number;
  minStudents: number;
  waitingListSize: number;
  waitingList: boolean;
  automaticApproval: boolean;
  availableForCourseCreation?: any;
  online?: any;
  level: ConfigDto;
  agendaEditable?: any;
  hierarchicalAgenda: any[];
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
  durationInHours?: any;
  durationInDays?: any;
  isInternal: boolean;
  pricing?: any;
  agoraProducts: any[];
  onlineDelivery?: any;
  registrationApprovalRequired?: any;
  categoryCode?: any;
  agoraProductSegmentCode?: any;
  agoraProductSegmentValue?: any;
  agoraProductSegmentNonEditable?: any;
  participationCertificate?: any;
  examCompletionAvailable: boolean;
  masterInternalRepositories: InternalRepositoryMaterial[];
  root: boolean;
  activeEventsCount?: any;
  totalEventsCount: number;
  archived?: any;
  deletable?: any;
  averageRating?: any;
  totalNumberOfReviews?: any;
  lxpEnabledDomain: boolean;
  publishStatus?: ConfigDto;
  lxpPrivate?: boolean;
  lxpRestrictUsers?: string[];
  lxpRestrictGroups?: { key: string; value: string }[];
  enrollmentPolicy?: ConfigDto;
  externalSKU?: string;
  specificExternalSKU?: boolean;
}

export interface SPCourseLanguageVariant {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  course: ActiveSelfPacedCourse;
  sku: string;
  classEvent: SelfPacedCourseClassEvent;
  language: ConfigDto;
  instructors?: any;
  trainingManagerId: string;
  trainingManagerName: string;
  trainingManagerEmail: string;
  trainingManagers: ITrainingManager[];
  conferenceLink?: any;
  selfRegistration: boolean;
  hierarchicalAgenda: any[];
  publishEvent: boolean;
  registrationDeadline?: any;
  registrationDeadlineDependsOnEventStartDate: boolean;
  step: string;
  closedRegistration?: any;
  remainingSeats: number;
  editLock: boolean;
  domainName: string;
  defaultSubdomain: string;
  historical: boolean;
  csvBucket?: any;
  csvKey?: any;
  cancellationMessage?: any;
  version: number;
  cancellable: boolean;
  learnerIsInstructor?: any;
  enrolledLearnerCounter: number;
  materials?: any;
  venuePreparationType?: any;
  serviceMarketplaceOrigin: boolean;
  seatPurchaseOrigin?: any;
  automaticCourseCompletion: boolean;
  courseEventPricing?: any;
  isInternal: boolean;
  returnablePeriod?: any;
  returnPeriodDependsOnEventStartDate: boolean;
  mandatoryAutomaticCourseCompletion?: any;
  waitingQueueStatus: ConfigDto;
  nextTicketNumber?: any;
  waitingQueueLength?: any;
  averageRating?: any;
  totalNumberOfReviews?: any;
  userLock: boolean;
  reviewsEnabled: boolean;
  lxpEnabledDomain: boolean;
  isInProgress: boolean;
  externalSKU?: string;
  specificExternalSKU?: boolean;
}

export interface PreSelfPacedCourse {
  agoraProductSegmentCode: null;
  agoraProductSegmentNonEditable: null;
  agoraProductSegmentValue: null;
  buyerId: string;
  code: null;
  comments: null;
  createdAt: Date;
  createdBy: string;
  expressCourse: ExpressCourse;
  format: ConfigDto;
  hasCustomImage: boolean;
  id: string;
  isInternal: boolean;
  name: string;
  rejectionReason: null;
  sellerAccountId: null;
  sellerId: string;
  sellerName: string;
  sellerPlatformName: string;
  status: ConfigDto;
  tab: SPCourseCreationStep;
  type: ConfigDto;
  updatedAt: Date;
  updatedBy: string;
  externalSKU?: string;
  specificExternalSKU?: boolean;
}