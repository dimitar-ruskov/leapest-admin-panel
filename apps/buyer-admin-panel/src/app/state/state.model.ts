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

export interface IGlobalStateModel {
  core: CoreStateModel;

  iltCourses: {
    iltCourseCreate: ILTCourseCreateStateModel;
    iltCoursesList: ILTCoursesListModel;
    iltCourseDetails: IltCourseDetailsModel;
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
