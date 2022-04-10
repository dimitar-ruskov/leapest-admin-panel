import {CoreStateModel} from "./core.state";
import {
  ILTCourseCreateStateModel
} from "../containers/ilt-courses/containers/ilt-course-create/state/ilt-course-create.state";
import {
  PublishedILTCoursesStateModel
} from "../containers/ilt-courses/containers/ilt-courses-list/state/published-ilt-courses.state";
import {
  IltCourseEventsCommonStateModel
} from "../containers/ilt-courses/containers/ilt-course-details/containers/ilt-course-events-tab/state/ilt-course-events-common.state";
import {
  ILTCoursesListStateModel
} from "../containers/ilt-courses/containers/ilt-courses-list/state/ilt-courses-list.state";
import {
  IltCourseDetailsStateModel
} from "../containers/ilt-courses/containers/ilt-course-details/state/ilt-course-details.state";
import {
  IltCourseDetailsNotificationsStateModel
} from "../containers/ilt-courses/containers/ilt-course-details/containers/ilt-course-notifications/state/ilt-course-details-notifications.state";
import {
  IltCourseReviewsStateModel
} from "../containers/ilt-courses/containers/ilt-course-details/containers/ilt-course-reviews/state/ilt-course-reviews.state";

import {CertificatesListStateModel} from "../containers/certificates/containers/certificates-list/state/certificates-list.state";
import {CertificateDetailsStateModel} from "../containers/certificates/containers/certificate-details/state/certificate-details.state";
import {CertificateCoursesStateModel} from "../containers/certificates/containers/certificate-details/state/certificate-courses.state";
import {CertificateIssuedStateModel} from "../containers/certificates/containers/certificate-details/state/certificate-issued.state";

import {
  NotificationDetailsStateModel
} from "../containers/notifications/containers/notification-details/state/notification-details.state";
import {
  NotificationsListStateModel
} from "../containers/notifications/containers/notifications/state/notifications-list.state";
import {
  NotificationsSettingsStateModel
} from "../containers/notifications/containers/notifications/state/notifications-settings.state";
import {PublishingStateModel} from "../containers/publishing/state/publishing.state";
import {InstructorsListState} from "../containers/instructors/containers/instructors-list/state/instructors-list.state";
import {
  InstructorDetailsState
} from "../containers/instructors/containers/instructor-details/state/instructor-details.state";
import {
  InternalRepositoryListState
} from "../containers/internal-repository/containers/internal-repository-list/state/internal-repository-list.state";
import {
  InternalRepositoryDetailsState
} from "../containers/internal-repository/containers/internal-repository-details/state/internal-repository-details.state";
import {
  InternalRepositoryVariantsState
} from "../containers/internal-repository/containers/internal-repository-details/state/internal-repository-variants.state";
import {
  InternalRepositoryCoursesState
} from "../containers/internal-repository/containers/internal-repository-details/state/internal-repository-courses.state";
import {
  MarketplaceRepositoryListState
} from "../containers/marketplace-repository/containers/marketplace-repository-list/state/marketplace-repository-list.state";
import {
  SpCoursesListStateModel
} from "../containers/self-paced-courses/containers/sp-courses-list/state/sp-courses-list.state";
import {
  ActiveSpCoursesListState
} from "../containers/self-paced-courses/containers/sp-courses-list/state/active-sp-courses-list/active-sp-courses-list.state";
import {
  DraftSpCoursesListStateModel
} from "../containers/self-paced-courses/containers/sp-courses-list/state/draft-sp-courses-list/draft-sp-courses-list.state";
import {
  SpCourseCreateStateModel
} from "../containers/self-paced-courses/containers/sp-course-create/state/sp-course-create.state";
import {
  SpCourseDetailsStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/state/sp-course-details.state";
import {
  SpCourseVariantsStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/state/sp-course-variants.state";
import {
  SpCourseVariantCreateState, SpCourseVariantCreateStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/sp-course-variant-create/state/sp-course-variant-create.state";
import {
  SpCourseVariantDetailsStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/state/sp-course-variant-details.state";
import {
  SpCourseVariantExamsStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/state/sp-course-variant-exams/sp-course-variant-exams.state";
import {
  SpCourseVariantMaterialsTrackingStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/state/sp-course-variant-materials-tracking/sp-course-variant-materials-tracking.state";
import {
  SpCourseVariantLearnersPendingStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/state/sp-course-variant-learners/sp-course-variant-learners-pending.state";
import {
  SpCourseVariantLearnersEnrolledStateModel
} from "../containers/self-paced-courses/containers/sp-course-details/containers/sp-course-variants/sp-course-variant-details/state/sp-course-variant-learners/sp-course-variant-learners-enrolled.state";

export interface IGlobalStateModel {
  core: CoreStateModel;

  iltCourses: {
    iltCourseCreate: ILTCourseCreateStateModel;
    iltCoursesList: ILTCoursesListModel;
    iltCourseDetails: IltCourseDetailsModel;
  };

  selfPacedCourses: {
    SpCourseCreate: SpCourseCreateStateModel;
    spCoursesList: SpCoursesListModel;
    spCourseDetail: SpCourseDetailsStateModel;
    spCourseVariants: SpCourseVariantsModel;
  };

  internalRepository: {
    internalRepositoryList: InternalRepositoryListState;
    internalRepositoryDetails: InternalRepositoryDetailsState;
    internalRepositoryVariants: InternalRepositoryVariantsState;
    internalRepositoryCourses: InternalRepositoryCoursesState;
  };

  marketplaceRepository: MarketplaceRepositoryListState;

  instructors: {
    instructorsList: InstructorsListState;
    instructorDetails: InstructorDetailsState;
  };

  certificates: {
    certificatesList: CertificatesListStateModel;
    certificateDetails: CertificateDetailsStateModel;
    certificateCourses: CertificateCoursesStateModel;
    certificateIssued: CertificateIssuedStateModel;
  };

  notifications: {
    activeTab: number;
    notificationsSettings: NotificationsSettingsStateModel;
    notificationsList: NotificationsListStateModel;
    notificationDetails: NotificationDetailsStateModel;
  };

  publishing: PublishingStateModel;
}

interface ILTCoursesListModel extends ILTCoursesListStateModel {
  draftIltCourses: PublishedILTCoursesStateModel;
  publishedIltCourses: PublishedILTCoursesStateModel;
}

interface IltCourseDetailsModel extends IltCourseDetailsStateModel {
  iltCourseEventsCommon: IltCourseEventsCommonStateModel;
  iltCourseDetailsNotifications: IltCourseDetailsNotificationsStateModel;
  courseReviews: IltCourseReviewsStateModel;
}

interface SpCoursesListModel extends SpCoursesListStateModel {
  activeSpCoursesList: ActiveSpCoursesListState;
  draftSpCoursesList: DraftSpCoursesListStateModel;
}

interface SpCourseVariantsModel extends SpCourseVariantsStateModel {
  spCourseVariants: SpCourseVariantCreateState;
  spCourseVariantCreate: SpCourseVariantCreateStateModel;
  spCourseVariantDetails: SpCourseVariantDetailsModel;
}

interface SpCourseVariantDetailsModel extends SpCourseVariantDetailsStateModel {
  spCourseVariantExams: SpCourseVariantExamsStateModel;
  spCourseVariantMaterialsTracking: SpCourseVariantMaterialsTrackingStateModel;
  spCourseVariantLearnersPending: SpCourseVariantLearnersPendingStateModel;
  spCourseVariantLearnersEnrolled: SpCourseVariantLearnersEnrolledStateModel;
}
