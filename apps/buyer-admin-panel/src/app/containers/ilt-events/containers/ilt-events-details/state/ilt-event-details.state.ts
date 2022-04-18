import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import produce, { Draft } from "immer";
import { Observable, of, timer } from "rxjs";
import { catchError, filter, map, switchMap, take, takeWhile, tap } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd/message";

import {
  AttendanceTrackingService
} from "../../../../../../../../../libs/shared/src/lib/services/events/attendance-tracking.service";
import {
  IltEventLearnersService
} from "../../../../../../../../../libs/shared/src/lib/services/events/ilt-event-learners.service";
import { IltEventsService } from "../../../../../../../../../libs/shared/src/lib/services/events/ilt-events.service";
import {
  WaitingListService
} from "../../../../../../../../../libs/shared/src/lib/services/events/waiting-list.service";
import {
  ChangeILTEventExamsPaginationParams,
  GetILTEventExams
} from "../containers/ilt-event-exams/state/ilt-event-exams.actions";
import { IltEventExamsState } from "../containers/ilt-event-exams/state/ilt-event-exams.state";
import {
  ChangeEnrolledILTEventLearnersPaginationParams,
  GetEnrolledILTEventLearners
} from "../containers/ilt-event-learners/ilt-event-learners-enrolled/state/ilt-event-learners-enrolled.actions";
import {
  IltEventLearnersEnrolledState
} from "../containers/ilt-event-learners/ilt-event-learners-enrolled/state/ilt-event-learners-enrolled.state";
import {
  GetPendingILTEventLearners
} from "../containers/ilt-event-learners/ilt-event-learners-pending/state/ilt-event-learners-pending.actions";
import {
  IltEventLearnersPendingState
} from "../containers/ilt-event-learners/ilt-event-learners-pending/state/ilt-event-learners-pending.state";
import {
  ChangeILTEventMaterialTrackingListPaginationParams,
  GetILTEventMaterialTrackingList
} from "../containers/ilt-event-materials-tracking/state/ilt-event-materials-tracking.actions";
import {
  IltEventMaterialsTrackingState
} from "../containers/ilt-event-materials-tracking/state/ilt-event-materials-tracking.state";
import {
  ChangeWaitingListPaginationParams,
  GetWaitingList
} from "../containers/waiting-list/state/waiting-list.actions";
import { WaitingListState } from "../containers/waiting-list/state/waiting-list.state";
import { EventReviewsState } from "../containers/ilt-event-reviews/state/ilt-event-reviews.state";
import {
  ApproveLearnerRegistrationRequest,
  AssignLearnersToILTEvent,
  BulkCompleteILTEventAttendances,
  BulkMarkILTEventAttendances,
  ChangeILTEventAttendancesFilter,
  ChangeILTEventAttendancesPage,
  ChangeILTEventAttendancesSort,
  CompleteILTEventAttendance,
  DisableWaitingList,
  DiscardILTEventAgendaChanges,
  EnableWaitingList,
  ExportLearnerFromILTEvent,
  GenerateEventThumbnail,
  GetCompleteILTEventDetails,
  GetILTEventAttendancesByUsers,
  RejectLearnerRegistrationRequest,
  RemoveLearnerFromILTEvent,
  UnmarkCompletion,
  UpdateILTEventAgenda,
  UpdateILTEventAttendance,
  UpdateILTEventAttribute,
  UploadEventThumbnail,
  UploadLearnersFromCSVToILTEvent
} from "./ilt-event-details.actions";
import {
  IltEventDetailsNotificationsState
} from "../containers/ilt-event-notifications/state/ilt-event-details-notifications.state";
import {
  EmailHistoryState
} from "../containers/ilt-event-notifications/ilt-event-notification-details/email-history/state/email-history.state";

import { DeferredResource } from "../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  AmberResponse,
  AssignLearnersResponse,
  FlattenedCourseDetails,
  ILTEvent,
  ILTEventAttendance,
  ILTEventAttendancesByUser,
  ILTEventBulkMarkAttendancesPayload,
  IPageable
} from "../../../../../../../../../libs/shared/src/lib/models";
import {
  AdminCoursesService
} from "../../../../../../../../../libs/shared/src/lib/services/events/admin-courses.service";

export class IltEventDetailsStateModel {
  iltEvent: DeferredResource<ILTEvent>;
  iltEventAttendancesByUsers: DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>;
  paginationILTEventAttendanceTracking: IPageable;
  iltEventAttendanceUpdating: boolean;
}

@State<IltEventDetailsStateModel>({
  name: 'iltEventDetails',
  defaults: {
    iltEvent: undefined,
    iltEventAttendancesByUsers: undefined,
    iltEventAttendanceUpdating: false,
    paginationILTEventAttendanceTracking: { limit: 10, page: 1, filter: '', filterParams: [], sort: null },
  },
  children: [
    IltEventLearnersEnrolledState,
    IltEventLearnersPendingState,
    IltEventMaterialsTrackingState,
    IltEventExamsState,
    WaitingListState,
    EventReviewsState,
    IltEventDetailsNotificationsState,
    EmailHistoryState,
  ],
})
@Injectable()
export class IltEventDetailsState {
  @Selector([IltEventDetailsState])
  static iltEvent(state: IltEventDetailsStateModel): DeferredResource<ILTEvent> {
    return state.iltEvent;
  }

  @Selector([IltEventDetailsState])
  static iltEventAttendancesByUsers(
    state: IltEventDetailsStateModel,
  ): DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }> {
    return state.iltEventAttendancesByUsers;
  }

  @Selector([IltEventDetailsState])
  static iltEventAttendanceUpdating(state: IltEventDetailsStateModel): boolean {
    return state.iltEventAttendanceUpdating;
  }

  @Selector([IltEventDetailsState])
  static paginationILTEventAttendanceTracking(state: IltEventDetailsStateModel): IPageable {
    return state.paginationILTEventAttendanceTracking;
  }

  constructor(
    private readonly iltEventService: IltEventsService,
    private readonly iltEventLearnersService: IltEventLearnersService,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly attendanceTrackingService: AttendanceTrackingService,
    private readonly waitingListService: WaitingListService,
    private readonly messageService: NzMessageService,
  ) {}

  @Action(GetCompleteILTEventDetails)
  getILTEventDetails(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { sku }: GetCompleteILTEventDetails,
  ): Observable<DeferredResource<ILTEvent>> {
    return this.iltEventService.getILTEventDetails(sku).pipe(
      tap((iltEvent: DeferredResource<ILTEvent>) => {
        patchState({ iltEvent });
      }),
    );
  }

  @Action(RemoveLearnerFromILTEvent)
  removeLearnerFromILTEvent(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { eventId, data }: RemoveLearnerFromILTEvent,
  ): Observable<AssignLearnersResponse> {
    const { iltEvent } = getState();
    return this.iltEventLearnersService.removeLearner(eventId, data).pipe(
      tap((removeRes: AssignLearnersResponse) => {
        timer(0, 3000)
          .pipe(
            switchMap((_) => this.iltEventService.getILTEventDetails(iltEvent.response.sku)),
            filter((res) => res.isSuccess),
            takeWhile((result) => result.response.userLock === true, true),
            filter((res) => !res.response.userLock),
            map((_) => _.response),
          )
          .subscribe((res: ILTEvent) => {
            if (res) {
              const u_iltEvent = produce(iltEvent.response, (draft) => {
                draft.waitingQueueLength = res.waitingQueueLength;
                draft.remainingSeats = res.remainingSeats;
                draft.classEvent = res.classEvent;
                draft.enrolledLearnerCounter = res.enrolledLearnerCounter;
              });
              patchState({ iltEvent: DeferredResource.success(u_iltEvent) });
              dispatch([
                new ChangeEnrolledILTEventLearnersPaginationParams({ pageable: { page: 1 } }),
                new GetEnrolledILTEventLearners({ classEventId: iltEvent.response.classEvent.id }),
                new ChangeILTEventMaterialTrackingListPaginationParams({ pageable: { page: 1 } }),
                new GetILTEventMaterialTrackingList({ eventId: iltEvent.response.id }),
                new ChangeILTEventExamsPaginationParams({ pageable: { page: 1 } }),
                new GetILTEventExams({ eventId: iltEvent.response.id }),
                new ChangeILTEventAttendancesPage(1),
                new GetILTEventAttendancesByUsers(iltEvent.response.sku),
                new ChangeWaitingListPaginationParams({ pageable: { page: 1 } }),
                new GetWaitingList({ classEventId: iltEvent.response.classEvent.id }),
              ]);
            }
          });
      }),
    );
  }

  @Action(ExportLearnerFromILTEvent)
  exportLearnerFromILTEvent(
    { patchState, getState }: StateContext<IltEventDetailsStateModel>,
    { payload }: ExportLearnerFromILTEvent,
  ): void {
    const { classEventId, csvType, statuses } = payload;
    this.iltEventLearnersService
      .exportLearners(classEventId, csvType, statuses)
      .pipe(take(1))
      .subscribe(() => {
        this.messageService.success('Report will be sent on your email');
      });
  }

  @Action(UploadLearnersFromCSVToILTEvent)
  uploadLearnersFromCSVToILTEvent(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { eventId, data }: UploadLearnersFromCSVToILTEvent,
  ): Observable<AssignLearnersResponse> {
    const { iltEvent } = getState();
    return this.iltEventLearnersService.uploadLearnersFromCSVToILTEvent(eventId, data).pipe(
      tap((assignRes: AssignLearnersResponse) => {
        timer(0, 3000)
          .pipe(
            switchMap((_) => this.iltEventService.getILTEventDetails(iltEvent.response.sku)),
            filter((res) => res.isSuccess),
            takeWhile((result) => result.response.userLock === true, true),
            filter((res) => !res.response.userLock),
            map((_) => _.response),
          )
          .subscribe((res: ILTEvent) => {
            if (res) {
              const u_iltEvent: ILTEvent = {
                ...iltEvent.response,
                remainingSeats: res.remainingSeats,
                classEvent: res.classEvent,
              };
              patchState({ iltEvent: DeferredResource.success(u_iltEvent) });
              dispatch([
                new GetEnrolledILTEventLearners({ classEventId: iltEvent.response.classEvent.id }),
                new GetILTEventMaterialTrackingList({ eventId: iltEvent.response.id }),
                new GetILTEventExams({ eventId: iltEvent.response.id }),
                new GetILTEventAttendancesByUsers(iltEvent.response.sku),
              ]);
            }
          });
      }),
    );
  }

  @Action(AssignLearnersToILTEvent)
  assignLearnersToILTEvent(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { eventId, data }: AssignLearnersToILTEvent,
  ): Observable<AssignLearnersResponse> {
    const { iltEvent } = getState();

    return this.iltEventLearnersService.assignLearners(eventId, data).pipe(
      tap((assignRes: AssignLearnersResponse) => {
        timer(0, 3000)
          .pipe(
            switchMap((_) => this.iltEventService.getILTEventDetails(iltEvent.response.sku)),
            filter((res) => res.isSuccess),
            takeWhile((result) => result.response.userLock === true, true),
            filter((res) => !res.response.userLock),
            map((_) => _.response),
          )
          .subscribe((res: ILTEvent) => {
            if (res) {
              const u_iltEvent: ILTEvent = {
                ...iltEvent.response,
                remainingSeats: res.remainingSeats,
                enrolledLearnerCounter: res.enrolledLearnerCounter,
                classEvent: res.classEvent,
              };
              patchState({ iltEvent: DeferredResource.success(u_iltEvent) });
              dispatch([
                new GetEnrolledILTEventLearners({ classEventId: iltEvent.response.classEvent.id }),
                new GetILTEventMaterialTrackingList({ eventId: iltEvent.response.id }),
                new GetILTEventExams({ eventId: iltEvent.response.id }),
                new GetILTEventAttendancesByUsers(iltEvent.response.sku),
              ]);
            }
          });
      }),
    );
  }

  @Action(GenerateEventThumbnail)
  generateEventThumbnail(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { data }: GenerateEventThumbnail,
  ): Observable<AmberResponse<FlattenedCourseDetails>> {
    const { iltEvent } = getState();
    return this.adminCoursesService.generateCourseThumbnail(data).pipe(
      tap((res: AmberResponse<FlattenedCourseDetails>) => {
        if (res) {
          const payload = produce(iltEvent.response, (a: ILTEvent) => {
            a.course.thumbnailUrl =
              'https://itpx-public-product-images-prod.s3-eu-west-1.amazonaws.com/fallback-thumbnail.png';
          });
          patchState({ iltEvent: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UploadEventThumbnail)
  uploadEventThumbnail(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { data }: UploadEventThumbnail,
  ): Observable<AmberResponse<FlattenedCourseDetails>> {
    const { iltEvent } = getState();
    return this.adminCoursesService.uploadThumbnail(data.courseId, data.s3BucketData).pipe(
      tap((res: AmberResponse<FlattenedCourseDetails>) => {
        if (res?.data) {
          const payload = produce(iltEvent.response, (a: ILTEvent) => {
            a.course.thumbnailUrl = res.data.thumbnailUrl;
            a.course.thumbnailKey = res.data.thumbnailKey;
          });
          patchState({ iltEvent: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UpdateILTEventAttribute)
  updateILTEventAttribute(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    action: UpdateILTEventAttribute,
  ): Observable<DeferredResource<ILTEvent>> {
    const { attribute } = action.payload;
    let { updatedILTEvent, props } = action.payload;
    const updated = updatedILTEvent;
    const { iltEvent } = getState();
    const isUpdatingInstructors = props.includes('instructors');
    const isUpdatingMeetingType = props.includes('externalMeetingType');

    /* This spike is here because of BE bug, which returns null value for instructors after updating,
     * so we patch state with data available on FE
     */

    if (isUpdatingInstructors) {
      updatedILTEvent = produce(updatedILTEvent, (draft: Draft<any>) => {
        draft.instructors = updatedILTEvent.instructors.map((instructor) => ({ id: instructor.id }));
      });
    }

    return this.iltEventService.updateILTEventAttribute(updatedILTEvent, attribute).pipe(
      tap((resource: DeferredResource<ILTEvent>) => {
        if (resource.isSuccess) {
          let payload: ILTEvent;
          if (isUpdatingInstructors && isUpdatingMeetingType) {
            payload = produce(iltEvent.response, (draft) => {
              draft.instructors = updated.instructors;
              props.forEach((updatedName) => {
                draft[updatedName] = resource.response[updatedName];
              });
            });
          } else if (isUpdatingInstructors) {
            payload = produce(iltEvent.response, (draft) => {
              draft.instructors = updated.instructors;
            });
          } else if (props.includes('participation-certificate-enabled')) {
            payload = produce(iltEvent.response, (draft) => {
              draft.participationCertificateEnabled = updated.participationCertificateEnabled;
            });
          } else {
            payload = produce(iltEvent.response, (draft) => {
              if (!props || props.length === 0) {
                props = [attribute];
              }

              props.forEach((updatedName) => {
                draft[updatedName] = resource.response[updatedName];
              });
            });
          }
          patchState({ iltEvent: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(UpdateILTEventAgenda)
  updateILTEventAgenda(
    { patchState, getState }: StateContext<IltEventDetailsStateModel>,
    { data, key }: UpdateILTEventAgenda,
  ): Observable<DeferredResource<ILTEvent>> {
    const { iltEvent } = getState();

    return this.iltEventService.updateILTEventAttribute(data, key).pipe(
      tap((res: DeferredResource<ILTEvent>) => {
        if (res.isSuccess) {
          const payload = produce(iltEvent.response, (a: ILTEvent) => {
            a.hierarchicalAgenda = res.response.hierarchicalAgenda;
            a.classEvent = res.response.classEvent;
          });

          patchState({ iltEvent: DeferredResource.success(payload) });
        }
      }),
    );
  }

  @Action(DiscardILTEventAgendaChanges)
  discardILTEventAgendaChanges({ patchState, getState }: StateContext<IltEventDetailsStateModel>) {
    const { iltEvent } = getState();
    const clone = produce(iltEvent.response, (draft) => {
      draft.hierarchicalAgenda = [...iltEvent.response.hierarchicalAgenda];
    });

    patchState({ iltEvent: DeferredResource.success(clone) });
  }

  @Action(GetILTEventAttendancesByUsers)
  getILTEventAttendancesByUsers(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { eventSku }: GetILTEventAttendancesByUsers,
  ): Observable<DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>> {
    const { paginationILTEventAttendanceTracking: pageable } = getState();

    return this.attendanceTrackingService.getILTEventAttendancesByUsers(eventSku, pageable).pipe(
      tap(
        (
          iltEventAttendancesByUsers: DeferredResource<{ data: ILTEventAttendancesByUser[]; flags: { size: number } }>,
        ) => {
          patchState({ iltEventAttendancesByUsers, iltEventAttendanceUpdating: false });
        },
      ),
    );
  }

  @Action(ChangeILTEventAttendancesPage)
  changeILTEventAttendancesPage(
    { patchState, getState }: StateContext<IltEventDetailsStateModel>,
    action: ChangeILTEventAttendancesPage,
  ): void {
    const { paginationILTEventAttendanceTracking } = getState();

    patchState({
      paginationILTEventAttendanceTracking: { ...paginationILTEventAttendanceTracking, page: action.payload },
    });
  }

  @Action(ChangeILTEventAttendancesFilter)
  changeILTEventAttendancesFilter(
    { patchState, getState }: StateContext<IltEventDetailsStateModel>,
    action: ChangeILTEventAttendancesFilter,
  ): void {
    const { paginationILTEventAttendanceTracking } = getState();

    patchState({
      paginationILTEventAttendanceTracking: { ...paginationILTEventAttendanceTracking, filter: action.payload },
    });
  }

  @Action(ChangeILTEventAttendancesSort)
  changeILTEventAttendancesSort(
    { patchState, getState }: StateContext<IltEventDetailsStateModel>,
    action: ChangeILTEventAttendancesSort,
  ): void {
    const { paginationILTEventAttendanceTracking } = getState();

    patchState({
      paginationILTEventAttendanceTracking: { ...paginationILTEventAttendanceTracking, sort: action.payload },
    });
  }

  @Action(UpdateILTEventAttendance)
  updateILTEventAttendance(
    { patchState, setState, getState }: StateContext<IltEventDetailsStateModel>,
    action: UpdateILTEventAttendance,
  ): Observable<ILTEvent> {
    const { eventId, data } = action.payload;
    const { iltEventAttendancesByUsers } = getState();

    patchState({ iltEventAttendanceUpdating: true });

    return this.attendanceTrackingService.updateILTEventAttendance(eventId, data).pipe(
      tap((updatedAttendance: ILTEventAttendance) => {
        const updatedAttendances = produce(iltEventAttendancesByUsers.response, (draft) => {
          const entryIndex = draft.data.findIndex((entry) => entry.user.id === data.user.id);

          if (entryIndex !== -1) {
            const attendanceIndex = draft.data[entryIndex].attendances.findIndex((attendanceEntry) => {
              return attendanceEntry.day === data.day;
            });

            if (attendanceIndex !== -1) {
              const storedAttendance = draft.data[entryIndex].attendances[attendanceIndex];

              // We need to patch day and date back, because for some reason server sets those to null in response
              draft.data[entryIndex].attendances[attendanceIndex] = {
                ...updatedAttendance,
                day: storedAttendance.day,
                date: storedAttendance.date,
              };
            }

            // Server doesn't return completed status, therefore we need to calculate it on client
            draft.data[entryIndex].completed = draft.data[entryIndex].attendances.every((entry) => !!entry.attendance);
          }
        });

        patchState({
          iltEventAttendancesByUsers: DeferredResource.success(updatedAttendances),
          iltEventAttendanceUpdating: false,
        });
      }),
      catchError((error) => {
        patchState({ iltEventAttendanceUpdating: false });
        return of(error);
      }),
    );
  }

  @Action(CompleteILTEventAttendance)
  completeILTEventAttendance(
    { patchState, setState, getState }: StateContext<IltEventDetailsStateModel>,
    action: CompleteILTEventAttendance,
  ): Observable<ILTEvent> {
    const { eventId, data } = action.payload;
    const { iltEventAttendancesByUsers } = getState();

    const updatedAttendances = produce(iltEventAttendancesByUsers.response, (draft) => {
      const entryIndex = draft.data.findIndex(
        (entry) => entry.user.username === data.attendances[0]?.learner?.username,
      );

      if (entryIndex !== -1) {
        draft.data[entryIndex].user.completionPercentage = data.completionPercentage;
      }
    });

    patchState({ iltEventAttendancesByUsers: DeferredResource.success(updatedAttendances) });

    return this.attendanceTrackingService.completeILTEventAttendance(eventId, data).pipe(
      tap((updatedILTEvent: ILTEvent) => {
        patchState({ iltEvent: DeferredResource.success(updatedILTEvent) });
      }),
    );
  }

  @Action(UnmarkCompletion)
  unmarkCompletion(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { payload }: UnmarkCompletion,
  ): Observable<ILTEvent> {
    const { eventId, data } = payload;
    const { iltEventAttendancesByUsers } = getState();

    const updatedAttendances = produce(iltEventAttendancesByUsers.response, (draft) => {
      const entryIndex = draft.data.findIndex(
        (entry) => entry.user.username === data.attendances[0]?.learner?.username,
      );

      if (entryIndex !== -1) {
        draft.data[entryIndex].user.completionPercentage = data.completionPercentage;
      }
    });

    patchState({ iltEventAttendancesByUsers: DeferredResource.success(updatedAttendances) });

    return this.attendanceTrackingService.unmarkCompletion(eventId, data).pipe(
      tap((updatedILTEvent: ILTEvent) => {
        patchState({ iltEvent: DeferredResource.success(updatedILTEvent) });
      }),
    );
  }

  @Action(BulkCompleteILTEventAttendances)
  bulkCompleteILTEventAttendances(
    { patchState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { payload }: BulkCompleteILTEventAttendances,
  ): Observable<ILTEvent> {
    const { eventId, data } = payload;

    return this.attendanceTrackingService.completeILTEventAttendance(eventId, data).pipe(
      tap((updatedILTEvent: ILTEvent) => {
        patchState({ iltEvent: DeferredResource.success(updatedILTEvent) });
        dispatch(new GetILTEventAttendancesByUsers(updatedILTEvent.sku));
      }),
    );
  }

  @Action(BulkMarkILTEventAttendances)
  bulkMarkILTEventAttendances(
    { patchState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { payload }: BulkMarkILTEventAttendances,
  ): Observable<ILTEventBulkMarkAttendancesPayload> {
    const { eventId, data } = payload;

    return this.attendanceTrackingService.markBulkAttendance(eventId, data);
  }

  @Action(RejectLearnerRegistrationRequest)
  rejectLearnerRegistrationRequest(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { data }: RejectLearnerRegistrationRequest,
  ): Observable<AssignLearnersResponse> {
    const { iltEvent } = getState();
    return this.iltEventLearnersService.rejectLearner(data).pipe(
      tap((res: AssignLearnersResponse) => {
        if (res) {
          dispatch([new GetPendingILTEventLearners({ classEventId: iltEvent.response.classEvent.id })]);
        }
      }),
    );
  }

  @Action(ApproveLearnerRegistrationRequest)
  approveLearnerRegistrationRequest(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { data }: ApproveLearnerRegistrationRequest,
  ): Observable<AssignLearnersResponse> {
    const { iltEvent } = getState();
    return this.iltEventLearnersService.approveLearner(data).pipe(
      tap((approveResult: AssignLearnersResponse) => {
        timer(0, 3000)
          .pipe(
            switchMap((_) => this.iltEventService.getILTEventDetails(iltEvent.response.sku)),
            filter((res) => res.isSuccess),
            takeWhile((result) => result.response.userLock === true, true),
            filter((res) => !res.response.userLock),
            map((_) => _.response),
          )
          .subscribe((res: ILTEvent) => {
            if (res) {
              const u_iltEvent: ILTEvent = {
                ...iltEvent.response,
                remainingSeats: res.remainingSeats,
                classEvent: res.classEvent,
                enrolledLearnerCounter: res.enrolledLearnerCounter,
              };
              patchState({ iltEvent: DeferredResource.success(u_iltEvent) });
              dispatch([
                new GetPendingILTEventLearners({ classEventId: iltEvent.response.classEvent.id }),
                new GetEnrolledILTEventLearners({ classEventId: iltEvent.response.classEvent.id }),
                new GetILTEventMaterialTrackingList({ eventId: iltEvent.response.id }),
                new GetILTEventExams({ eventId: iltEvent.response.id }),
                new GetILTEventAttendancesByUsers(iltEvent.response.sku),
              ]);
            }
          });
      }),
    );
  }

  @Action(EnableWaitingList)
  enableWaitingList(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { payload }: EnableWaitingList,
  ): Observable<DeferredResource<ILTEvent>> {
    const { iltEvent } = getState();
    return this.waitingListService.enableWaitingList(payload.eventId, payload.data).pipe(
      tap((res: DeferredResource<ILTEvent>) => {
        if (res.isSuccess) {
          const p = produce(iltEvent.response, (draft) => {
            draft.waitingQueueStatus = res.response.waitingQueueStatus;
            draft.course.waitingListSize = res.response.course.waitingListSize;
          });
          patchState({ iltEvent: DeferredResource.success(p) });
        }
      }),
    );
  }

  @Action(DisableWaitingList)
  disableWaitingList(
    { patchState, getState, dispatch }: StateContext<IltEventDetailsStateModel>,
    { payload }: DisableWaitingList,
  ): Observable<DeferredResource<ILTEvent>> {
    const { iltEvent } = getState();
    return this.waitingListService.disableWaitingList(payload.eventId).pipe(
      tap((res: DeferredResource<ILTEvent>) => {
        if (res.isSuccess) {
          const p = produce(iltEvent.response, (draft) => {
            draft.waitingQueueStatus = res.response.waitingQueueStatus;
          });
          patchState({ iltEvent: DeferredResource.success(p) });
        }
      }),
    );
  }
}
