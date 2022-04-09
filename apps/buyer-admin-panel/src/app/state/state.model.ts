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

import {CertificatesListStateModel} from "../containers/certificates/state/certificates-list/certificates-list.state";
import {CertificateDetailsStateModel} from "../containers/certificates/state/certificates-details/certificate-details.state";
import {CertificateCoursesStateModel} from "../containers/certificates/state/certificates-details/certificate-courses.state";
import {CertificateIssuedStateModel} from "../containers/certificates/state/certificates-details/certificate-issued.state";

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

export interface IGlobalStateModel {
  core: CoreStateModel;

  iltCourses: {
    iltCourseCreate: ILTCourseCreateStateModel;
    iltCoursesList: ILTCoursesListModel;
    iltCourseDetails: IltCourseDetailsModel;
  }
  certificates: {
    certificatesList: CertificatesListStateModel;
    certificateDetails: CertificateDetailsStateModel;
    certificateCourses: CertificateCoursesStateModel;
    certificateIssued: CertificateIssuedStateModel;
  }
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
