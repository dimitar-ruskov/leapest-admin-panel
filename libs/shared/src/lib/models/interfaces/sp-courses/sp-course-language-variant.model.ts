import { ActiveSelfPacedCourse, SelfPacedCourseClassEvent } from './sp-course.model';
import {ConfigDto} from "../common/config-dto.model";
import {ITrainingManager} from "../courses/ilt-event.model";

export interface PreSPCourseLanguageVariantCreatePayload {
  course: {
    id: string;
  };
  classEvent: {
    virtualVenue: true;
    selfPacedClass: true;
    displayName: string;
  };
  historical: false;
  isInternal: true;
  language: {
    configKey: string;
  };
}

export interface PreSPCourseLanguageVariant {
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
  trainingManagerId?: any;
  trainingManagerName?: any;
  trainingManagerEmail?: any;
  trainingManagers?: ITrainingManager[];
  conferenceLink?: any;
  selfRegistration: boolean;
  hierarchicalAgenda: any[];
  publishEvent: boolean;
  registrationDeadline?: any;
  registrationDeadlineDependsOnEventStartDate: boolean;
  step?: any;
  closedRegistration?: any;
  remainingSeats?: any;
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
  automaticCourseCompletion?: any;
  courseEventPricing?: any;
  isInternal: boolean;
  returnablePeriod?: any;
  returnPeriodDependsOnEventStartDate: boolean;
  mandatoryAutomaticCourseCompletion?: any;
  waitingQueueStatus?: any;
  nextTicketNumber?: any;
  waitingQueueLength?: any;
  averageRating?: any;
  totalNumberOfReviews?: any;
  userLock: boolean;
  reviewsEnabled: boolean;
  lxpEnabledDomain: boolean;
  externalSKU?: string;
}

export interface UpdateSpCourseLanguageVariantLearnersResponse {
  courseEventId: string;
  enrolledLearners: number;
  message: string;
  remainingSeats: number;
  remainingWaitlistSeats: number;
  userLock: boolean;
  username: string;
  waitListedLearners: string[];
}
