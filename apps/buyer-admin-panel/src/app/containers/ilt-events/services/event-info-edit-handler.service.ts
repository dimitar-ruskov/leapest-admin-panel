import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import produce, { Draft } from 'immer';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import {
  DisableWaitingList,
  EnableWaitingList,
  GenerateEventThumbnail,
  UpdateILTEventAttribute,
  UploadEventThumbnail,
} from '../containers/ilt-events-details/state/ilt-event-details.actions';

import {
  ConferencingTool,
  IKeyValuePair,
  ILTCourseAgendaDay,
  ILTEvent,
  ILTInstructor, S3BucketData
} from "../../../../../../../libs/shared/src/lib/models/interfaces";
import {formatDate} from "../../../../../../../libs/shared/src/lib/utils/common";
import {
  EditTrainingManagerModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-training-manager-modal/edit-training-manager-modal.component";
import {
  EditExternalSKUModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-external-sku-modal/edit-external-sku-modal.component";
import {
  EditSelfRegistrationModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-self-registration-modal/edit-self-registration-modal.component";
import {
  EditConferenceLinkModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-conference-link-modal/edit-conference-link-modal.component";
import {
  CourseThumbnailHandlerService
} from "../../../../../../../libs/shared/src/lib/utils/services/course-thumbnail-handler.service";
import {
  EditAttendanceTrackingSettingsModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-attendance-tracking-settings-modal/edit-attendance-tracking-settings-modal.component";
import {
  EditAddressModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-address-modal/edit-address-modal.component";
import {
  EditTimezoneModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-timezone-modal/edit-timezone-modal.component";
import {
  EditInstructorsModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-instructors-modal/edit-instructors-modal.component";
import {
  EditLanguageModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-language-modal/edit-language-modal.component";
import {
  BasicUserModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/basic-user-modal/basic-user-modal.component";
import {
  EditCourseCertificateComponent
} from "../../../../../../../libs/shared/src/lib/components/feature/edit-course-certificate/edit-course-certificate.component";
import {
  EditNumberOfLearnersModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-number-of-learners-modal/edit-number-of-learners-modal.component";
import {
  EditWaitingListModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-waiting-list-modal/edit-waiting-list-modal.component";
import {
  AddAddressModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/add-address-modal/add-address-modal.component";
import {AdminCoursesService} from "../../../../../../../libs/shared/src/lib/utils/services";
import {
  EditVirtualMeetingsModalComponent
} from "../../../../../../../libs/shared/src/lib/components/modals/edit-virtual-meetings-modal/edit-virtual-meetings-modal.component";


@Injectable({
  providedIn: 'root',
})
export class EventInfoEditHandlerService {
  constructor(
    private readonly store: Store,
    private readonly modalService: NzModalService,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly courseThumbnailHandlerService: CourseThumbnailHandlerService,
  ) {}

  generateThumbnail(iltEventId: string): void {
    this.courseThumbnailHandlerService.generateThumbnail(() => {
      return this.store.dispatch(new GenerateEventThumbnail({ id: iltEventId }));
    });
  }

  uploadThumbnail(thumbnailUrl: string, courseId: string): void {
    this.courseThumbnailHandlerService.uploadThumbnail(thumbnailUrl, (s3BucketData: S3BucketData) => {
      return this.store.dispatch(new UploadEventThumbnail({ courseId, s3BucketData }));
    });
  }

  editProperty(fieldId: string, iltEvent: ILTEvent): void {
    switch (fieldId) {
      case 'language':
        this.updateLanguage(iltEvent);
        break;

      case 'conferenceLink':
        this.updateConferenceLink(iltEvent);
        break;

      case 'meetings':
        this.updateVirtualMeetings(iltEvent);
        break;

      case 'location':
        iltEvent.classEvent.virtualVenue
          ? iltEvent.conferenceLink
            ? this.updateConferenceLink(iltEvent)
            : this.updateVirtualMeetings(iltEvent)
          : this.updateAddress(iltEvent);
        break;

      case 'timezone':
        this.updateTimezone(iltEvent);
        break;

      case 'instructors':
        iltEvent.classEvent.virtualVenue && !iltEvent.conferenceLink
          ? this.updateVirtualMeetings(iltEvent)
          : this.updateInstructors(iltEvent);
        break;

      case 'trainingManager':
        this.updateTrainingManager(iltEvent);
        break;

      case 'seats':
        this.updateNumberOfLearners(iltEvent);
        break;

      case 'selfRegistration':
        this.updateSelfRegistration('Edit Self Registration', iltEvent);
        break;

      case 'registrationPeriod':
        this.updateSelfRegistration('Edit Registration Period', iltEvent);
        break;

      case 'registrationApproval':
        this.updateSelfRegistration('Edit Registration Approval', iltEvent);
        break;

      case 'waitingList':
        this.toggleWaitingList(iltEvent);
        break;

      case 'externalSKU':
        this.updateExternalSKU(iltEvent);
        break;

      case 'attendanceTracking':
        this.updateAttendanceTrackingSettings(iltEvent);
        break;

      case 'certificate-template':
        this.editCertificate(iltEvent);
        break;

      default:
        throw new Error('Wrong field id');
    }
  }

  updateLanguage(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Event Delivery Language',
      nzContent: EditLanguageModalComponent,
      nzComponentParams: {
        language: iltEvent.language.id,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const { language } = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.language.id = language;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'language',
                  props: ['language'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateVirtualMeetings(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Meetings',
      nzContent: EditVirtualMeetingsModalComponent,
      nzComponentParams: {
        _conferencingTool: iltEvent.externalMeetingType,
        _hierarchicalAgenda: iltEvent.hierarchicalAgenda,
        _instructors: iltEvent.instructors,
        _dates: iltEvent.hierarchicalAgenda.map((h) => moment(h.startDateTime).toISOString()),
        _eventId: iltEvent.id,
        _eventIsInProgress: iltEvent.isInProgress,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) =>
            d.form.invalid ||
            d.form.pristine ||
            d.checkLinks ||
            (d.instructorAccountError && d.form.value.conferencingTool !== 'manual'),
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.externalMeetingType = formValue.conferencingTool;
              draft.instructors = formValue.instructors;
              draft.hierarchicalAgenda.forEach((day: ILTCourseAgendaDay, index: number) => {
                day.externalMeetingEnabled = formValue.sessions[index].enabled;
                if (formValue.conferencingTool === 'manual') {
                  day.meeting = { joinURL: formValue.sessions[index].link };
                }
              });
            });
            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'meetings',
                  props: ['instructors', 'externalMeetingType', 'hierarchicalAgenda'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));

    modal
      .getContentComponent()
      .authConferencingTool.pipe(takeUntil(modalDestroyed$))
      .subscribe((ct: ConferencingTool) => {
        modal.close();
        window.location.replace(
          `https://zoom.us/oauth/authorize?response_type=code&client_id=${ct.clientId}&state=details,${iltEvent.id}&redirect_uri=${window.location.origin}/hw/admin/zoom-auth-landing`,
        );
      });
    modal
      .getContentComponent()
      .addInstructor.pipe(takeUntil(modalDestroyed$))
      .subscribe(() => {
        modal.close();
        this.addInstructor(iltEvent, 'meetings');
      });
  }

  updateConferenceLink(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Conference Link',
      nzContent: EditConferenceLinkModalComponent,
      nzComponentParams: {
        conferenceLink: iltEvent.conferenceLink,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.conferenceLink = formValue.conferenceLink;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'conference-link',
                  props: ['conferenceLink'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateAddress(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Event Address',
      nzContent: EditAddressModalComponent,
      nzComponentParams: {
        venue: iltEvent.classEvent.venue,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.classEvent.venue = formValue.venue;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'location',
                  props: ['classEvent'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));

    modal
      .getContentComponent()
      .addVenue.pipe(takeUntil(modalDestroyed$))
      .subscribe(({ allCountries }: { allCountries: IKeyValuePair[] }) => {
        modal.close();
        this.addVenue(iltEvent, allCountries);
      });
  }

  private addVenue(iltEvent: ILTEvent, allCountries: IKeyValuePair[]): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Add New Venue',
      nzContent: AddAddressModalComponent,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzComponentParams: {
        countries: allCountries,
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => d.form.invalid,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();

            formValue.country = allCountries.find((c) => c.key === formValue.country).value;

            return this.adminCoursesService
              .addVenue(formValue)
              .toPromise()
              .then((result) => {
                const updatedILTEvent = produce(iltEvent, (draft) => {
                  draft.classEvent.venue = result;
                });

                modal.destroy();
                this.updateAddress(updatedILTEvent);
              });
          },
        },
      ],
    });
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));
    const instance = modal.getContentComponent();

    instance.form
      .get('country')
      .valueChanges.pipe(
        switchMap((val: string) => this.adminCoursesService.getStateDictionary(val)),
        takeUntil(modalDestroyed$),
      )
      .subscribe((response) => {
        instance.form.get('state').patchValue(null);
        instance.states = response;
      });
  }

  updateTimezone(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Timezone',
      nzContent: EditTimezoneModalComponent,
      nzComponentParams: {
        timezone: iltEvent.classEvent.timezone,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.classEvent.timezone = formValue.timezone;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'timezone',
                  props: ['classEvent'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateInstructors(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Event Instructor(s)',
      nzContent: EditInstructorsModalComponent,
      nzComponentParams: {
        instructors: iltEvent.instructors,
        dates: iltEvent.hierarchicalAgenda.map((h) => moment(h.startDateTime).toISOString()),
        eventId: iltEvent.id,
        conferencingTool: iltEvent.externalMeetingType,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.instructorAccountError,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.instructors = formValue.instructors;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'instructor',
                  props: ['instructors'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
    const modalDestroyed$ = modal.afterClose.asObservable().pipe(take(1));

    modal
      .getContentComponent()
      .addInstructor.pipe(takeUntil(modalDestroyed$))
      .subscribe(() => {
        modal.close();
        this.addInstructor(iltEvent, 'instructors');
      });
  }

  private addInstructor(iltEvent: ILTEvent, attribute: string): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Add New Instructor',
      nzContent: BasicUserModalComponent,
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzComponentParams: {
        userLabel: 'Instructor',
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Proceed',
          type: 'primary',
          disabled: (d) => !d.form.valid,
          onClick: async (data) => {
            const formValue: ILTInstructor = { ...data.form.getRawValue(), source: 'ext' };

            return this.adminCoursesService
              .addInstructor(formValue)
              .toPromise()
              .then((newInstructor) => {
                modal.destroy();
                const updatedILTEvent = produce(iltEvent, (draft) => {
                  draft.instructors = [...iltEvent.instructors, newInstructor];
                });
                attribute === 'instructors'
                  ? this.updateInstructors(updatedILTEvent)
                  : this.updateVirtualMeetings(updatedILTEvent);
              });
          },
        },
      ],
    });
  }

  updateTrainingManager(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Training Manager',
      nzContent: EditTrainingManagerModalComponent,
      nzComponentParams: {
        selectedTrainingManagers: iltEvent.trainingManagers,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const { trainingManagers } = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.trainingManagers = trainingManagers;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'training-manager',
                  props: ['trainingManagers'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateNumberOfLearners(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Number of Learners',
      nzContent: EditNumberOfLearnersModalComponent,
      nzComponentParams: {
        learnerCount: iltEvent.enrolledLearnerCounter,
        minStudents: iltEvent.course.minStudents,
        maxSeats: iltEvent.course.maxSeats,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.course.minStudents = formValue.minLearners;
              draft.course.maxSeats = formValue.maxLearners;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'number-of-learners',
                  props: ['course', 'remainingSeats'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateSelfRegistration(title: string, iltEvent: ILTEvent): void {
    const {
      selfRegistration,
      course: { automaticApproval },
      registrationDeadlineDependsOnEventStartDate,
      registrationDeadline,
    } = iltEvent;

    const modal: NzModalRef = this.modalService.create({
      nzTitle: title,
      nzContent: EditSelfRegistrationModalComponent,
      nzComponentParams: {
        isSelfRegistrationEditable: !iltEvent.seatPurchaseOrigin,
        selfRegistration,
        automaticApproval,
        withRegistrationPeriod: true,
        registrationDeadlineDependsOnEventStartDate,
        registrationDeadline,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const dependsOnEventStartDate = formValue.registrationPeriod.registrationDeadlineDependsOnEventStartDate;
            const endDate = formValue.registrationPeriod.registrationPeriodEndDate;
            const endTime = formValue.registrationPeriod.registrationPeriodEndTime;

            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.selfRegistration = formValue.selfRegistration;
              draft.course.automaticApproval = formValue.automaticApproval;
              draft.registrationDeadlineDependsOnEventStartDate = dependsOnEventStartDate;
              draft.registrationDeadline =
                !dependsOnEventStartDate && endDate && endTime ? formatDate(endDate, endTime) : null;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'self-registration',
                  props: [
                    'selfRegistration',
                    'registrationDeadline',
                    'course',
                    'registrationDeadlineDependsOnEventStartDate',
                  ],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  toggleWaitingList(iltEvent: ILTEvent): void {
    const modal = this.modalService.create({
      nzTitle: 'Waiting List Settings',
      nzContent: EditWaitingListModalComponent,
      nzComponentParams: {
        enabled: iltEvent.waitingQueueStatus.configKey === 'enabled',
        size: iltEvent.course.waitingListSize,
        minSize: iltEvent.waitingQueueLength || 1,
      },
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            return this.store
              .dispatch(
                formValue.enabled
                  ? new EnableWaitingList({ eventId: iltEvent.id, data: { capacity: formValue.size } })
                  : new DisableWaitingList({ eventId: iltEvent.id }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }

  updateExternalSKU(iltEvent: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: iltEvent.course.specificExternalSKU ? 'Edit Custom Course Code' : 'Edit Internal Course Code / SKU',
      nzContent: EditExternalSKUModalComponent,
      nzComponentParams: {
        mainLabel: iltEvent.course.specificExternalSKU ? 'Custom Course Code' : 'Internal Course Code / SKU',
        subLabel: iltEvent.course.specificExternalSKU
          ? 'Please enter a code between 4 to 8 characters containing only digits and alphabets in upper case.'
          : 'Edit the Internal Course Code / SKU',
        initVal: iltEvent.course.externalSKU,
        pattern: iltEvent.course.specificExternalSKU ? /^[A-Z0-9]+$/i : undefined,
        minLength: iltEvent.course.specificExternalSKU ? 4 : undefined,
        maxLength: iltEvent.course.specificExternalSKU ? 8 : undefined,
        specificExternalSKU: iltEvent.course.specificExternalSKU,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.course.externalSKU = formValue.externalSKU || null;
            });

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'external-sku',
                  props: ['course'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  updateAttendanceTrackingSettings(iltEvent: ILTEvent): void {
    const { automaticAttendanceCompletion, automaticAttendanceTracking, completionRate } = iltEvent;
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Atttendance Tracking Settings',
      nzContent: EditAttendanceTrackingSettingsModalComponent,
      nzComponentParams: {
        automaticAttendanceCompletion,
        automaticAttendanceTracking,
        completionRate,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => d.form.invalid || d.form.pristine,
          onClick: async (data) => {
            const formValue = data.form.getRawValue();
            const updatedILTEvent = produce(iltEvent, (draft: Draft<ILTEvent>) => {
              draft.automaticAttendanceTracking = formValue.attendanceTracking;
              draft.automaticAttendanceCompletion = formValue.completion;
              draft.completionRate = formValue.completionPercent;
            });
            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'attendance-tracking',
                  props: ['automaticAttendanceTracking', 'automaticAttendanceCompletion', 'completionRate'],
                }),
              )
              .toPromise()
              .then(() => {
                modal.destroy();
              });
          },
        },
      ],
    });
  }

  private editCertificate(event: ILTEvent): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit Event Participation Certificate',
      nzContent: EditCourseCertificateComponent,
      nzComponentParams: {
        switcherValue: event.participationCertificateEnabled,
        currentCertificate: event.course.participationCertificate,
        isEvent: true,
      },
      nzWrapClassName: 'modal-class',
      nzWidth: 660,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Save Changes',
          type: 'primary',
          disabled: (d) => event.participationCertificateEnabled === d.isEnabled,
          onClick: async (data) => {
            const isEnabled = data.isEnabled;
            const updatedILTEvent = {
              ...event,
              participationCertificateEnabled: isEnabled,
            };

            return this.store
              .dispatch(
                new UpdateILTEventAttribute({
                  updatedILTEvent,
                  attribute: 'participation-certificate-enabled',
                  props: ['participation-certificate-enabled'],
                }),
              )
              .toPromise()
              .then((_) => modal.destroy());
          },
        },
      ],
    });
  }
}
