import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TrackByFunction } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { filter, map, startWith, switchMap, take } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import produce from "immer";
import * as moment from "moment";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { GoToEventCreationStep, UpdateILTEventDetails } from "../../state/ilt-events-create.actions";
import { IGlobalStateModel } from "../../../../../../state/state.model";

import {
  ConferencingTool,
  CourseEventInstructorsCollision,
  IKeyValuePair,
  ILTCourseAgendaDay,
  ILTEvent,
  ILTEventCreationStep,
  ILTInstructor,
  Venue
} from "../../../../../../../../../../libs/shared/src/lib/models";
import { CustomValidators, DeferredResource } from "../../../../../../../../../../libs/shared/src/lib/utils/common";
import {
  InstructorsCollisionsWarningsComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/feature/instructors-collisions-warnings/instructors-collisions-warnings.component";

import {
  BasicUserModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/basic-user-modal/basic-user-modal.component";
import {
  AddAddressModalComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/modals/add-address-modal/add-address-modal.component";
import {
  EnvironmentService
} from "../../../../../../../../../../libs/shared/src/lib/services/common/environment.service";
import {
  CourseEventInstructorsCollisionService
} from "../../../../../../../../../../libs/shared/src/lib/services/events/course-event-instructors-collision.service";
import {
  ConferencingToolService
} from "../../../../../../../../../../libs/shared/src/lib/services/events/conferencing-tool.service";
import {
  AdminCoursesService
} from "../../../../../../../../../../libs/shared/src/lib/services/events/admin-courses.service";

const ZOOM_GUIDE = "https://edcast-docs.document360.io/v1/docs/web-conferencing-in-edcast-courses-events";
const DISABLED_CHECKBOX = "Registration closes after event starts. Once started, Event cannot be cancelled.";

@Component({
  selector: "leap-ilt-event-create-scheduling-step",
  templateUrl: "./ilt-event-create-scheduling-step.component.html",
  styleUrls: ["./ilt-event-create-scheduling-step.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class IltEventCreateSchedulingStepComponent implements OnInit {
  @Select((state: IGlobalStateModel) => state.core.conferencingToolsDictionary)
  conferencingToolsDictionary$: Observable<ConferencingTool[]>;

  disabledCheckbox = DISABLED_CHECKBOX;
  updating = false;
  formInited = false;
  formInited2 = false;
  isSelectedConferenceToolAccountPro = false;
  today = new Date();
  registrationDeadlineDependsOnEventStartDateOptions: { key: boolean; value: string }[] = [
    {
      key: true,
      value: "Registration closes 12 hours prior the start of the Course Event"
    },
    {
      key: false,
      value: "Registration closes at a specified date"
    }
  ];

  attendanceTrackingOptions: { key: boolean; value: string; hint: string }[] = [
    {
      key: false,
      value: "Manual",
      hint: "The Event Manager will manually indicate attendance for each learner"
    },
    {
      key: true,
      value: "Automatic",
      hint: `Attendance will be automatically classified based on the following scale: 0% = "Not Attended"; 1-75% = "Partially Attended"; ≥76% = "Attended".
        To receive this information, please make sure that your instructor "Ends" the zoom meeting. Simply closing the meeting window will not record the attendance tracking.`
    }
  ];

  completionOptions: { key: boolean; value: string; hint: string }[] = [
    {
      key: false,
      value: "Manual",
      hint: "The Event Manager will manually indicate course completion for each learner."
    },
    {
      key: true,
      value: "Automatic",
      hint: "Completion will be automatically registered based on your criteria."
    }
  ];

  instructorDropdownOpen = false;
  instructors$: Observable<ILTInstructor[]>;
  venueCountries$: Observable<IKeyValuePair[]>;
  venueCities$: Observable<IKeyValuePair[]>;
  venues$: Observable<Venue[]>;
  allCountries: IKeyValuePair[];
  @Input() iltEvent: ILTEvent;

  form: FormGroup = this.fb.group({
    instructors: [],
    conferencingTool: [],
    registrationDeadlineDependsOnEventStartDate: [],
    registrationPeriodEndDate: [],
    registrationPeriodEndTime: [],
    sessions: this.fb.array([]),
    venue: [],
    country: [],
    city: [],
    attendanceTracking: [],
    completion: [],
    completionPercent: [],
    automaticCancellation: false
  });

  get sessions(): FormArray {
    return this.form.get("sessions") as FormArray;
  }

  get conferencingTool(): FormControl {
    return this.form.get("conferencingTool") as FormControl;
  }

  get countryControl(): FormControl {
    return this.form.get("country") as FormControl;
  }

  get completionControl(): FormControl {
    return this.form.get("completion") as FormControl;
  }

  get attendanceTrackingControl(): FormControl {
    return this.form.get("attendanceTracking") as FormControl;
  }

  get cityControl(): FormControl {
    return this.form.get("city") as FormControl;
  }

  get venueControl(): FormControl {
    return this.form.get("venue") as FormControl;
  }

  get registrationDeadlineDependsOnEventStartDate(): FormControl {
    return this.form.get("registrationDeadlineDependsOnEventStartDate") as FormControl;
  }

  get instructorsControl(): FormControl {
    return this.form.get("instructors") as FormControl;
  }

  constructor(
    private readonly fb: FormBuilder,
    public environmentService: EnvironmentService,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly adminCourseService: AdminCoursesService,
    private readonly modalService: NzModalService,
    private readonly detector: ChangeDetectorRef,
    private readonly conferencingService: ConferencingToolService,
    private readonly validationService: CourseEventInstructorsCollisionService
  ) {
  }

  trackByFn: TrackByFunction<FormControl> = (index: number) => index;

  private initFormArray(): void {
    this.iltEvent.hierarchicalAgenda.forEach((day: ILTCourseAgendaDay, index: number) => {
      this.sessions.push(
        this.fb.group({
          enabled: day.externalMeetingEnabled,
          link: [day.meeting?.joinURL ? day.meeting.joinURL : "", [CustomValidators.url]],
          date: day.startDateTime,
          index
        })
      );
    });
  }

  ngOnInit(): void {
    this.instructors$ = this.adminCourseService.getInstructors();
    this.adminCourseService
      .getCountryDictionary()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.allCountries = res;
      });
    const eventTime = new Date();
    eventTime.setHours(12);
    eventTime.setMinutes(0);
    eventTime.setSeconds(0);

    this.form.patchValue({
      instructors: this.iltEvent.instructors ? this.iltEvent.instructors : [],
      conferencingTool: this.iltEvent.externalMeetingType || "manual",
      registrationDeadlineDependsOnEventStartDate: this.iltEvent.isInternal
        ? this.iltEvent.registrationDeadlineDependsOnEventStartDate
        : true,
      registrationPeriodEndDate: this.iltEvent.registrationDeadline
        ? new Date(this.iltEvent.registrationDeadline)
        : new Date(),
      registrationPeriodEndTime: this.iltEvent.registrationDeadline
        ? new Date(this.iltEvent.registrationDeadline)
        : eventTime,
      venue: this.iltEvent.classEvent.venue ? this.iltEvent.classEvent.venue.id : null,
      country: this.iltEvent.classEvent.venue ? this.iltEvent.classEvent.venue.country : null,
      city: this.iltEvent.classEvent.venue ? this.iltEvent.classEvent.venue.city : null,
      attendanceTracking: !!this.iltEvent.automaticAttendanceTracking,
      completion: !!this.iltEvent.automaticAttendanceCompletion,
      completionPercent: this.iltEvent.completionRate || 80,
      automaticCancellation: this.iltEvent.automaticCancellation || false
    });

    this.instructorsControl.setAsyncValidators([this.validateInstructors.bind(this)]);
    this.instructorsControl.setValidators([Validators.required]);
    this.instructorsControl.valueChanges
      .pipe(
        switchMap((instructors) => {
          this.instructorDropdownOpen = false;
          return this.validationService.checkForCollision({
            eventId: this.iltEvent.id,
            instructors: instructors.map((i) => i.id),
            dates: this.iltEvent.hierarchicalAgenda.map((d) => moment(d.startDateTime).toISOString())
          });
        }),
        untilDestroyed(this)
      )
      .subscribe((val: DeferredResource<CourseEventInstructorsCollision[]>) => {
        if (val.isSuccess && val.response?.length) {
          const modal = this.modalService.create({
            nzContent: InstructorsCollisionsWarningsComponent,
            nzComponentParams: {
              instructorCollisions: val.response
            },
            nzWrapClassName: "modal-class",
            nzWidth: 660,
            nzCloseIcon: null,
            nzFooter: [
              {
                label: "Save Changes",
                type: "primary",
                onClick: async (data) => {
                  modal.destroy();
                }
              }
            ]
          });
        }
      });

    if (!this.iltEvent.classEvent.virtualVenue) {
      this.venueCountries$ = this.adminCourseService.getILTVenueCountriesDictionary();
      this.venueControl.setValidators([Validators.required]);

      this.venueCities$ = this.countryControl.valueChanges.pipe(
        startWith(this.countryControl.value),
        untilDestroyed(this),
        filter((_) => !!_),
        switchMap((country) => {
          if (this.formInited) {
            this.cityControl.patchValue(null);
          } else {
            this.formInited = true;
          }
          return this.adminCourseService.getILTVenueCitiesDictionary(country);
        })
      );
      this.venues$ = this.cityControl.valueChanges.pipe(
        startWith(this.cityControl.value),
        untilDestroyed(this),
        switchMap((res) => {
          if (this.formInited2) {
            this.venueControl.patchValue(null);
          } else {
            this.formInited2 = true;
          }
          if (res) {
            return this.adminCourseService.getILTVenuesInCity(res);
          } else {
            return of([]);
          }
        })
      );
    } else {
      this.conferencingTool.setValidators([Validators.required]);
      this.conferencingTool.valueChanges
        .pipe(
          startWith(this.conferencingTool.value),
          filter((val) => val !== "manual"),
          switchMap((val) => this.conferencingService.checkIfAccountIsPro(val)),
          untilDestroyed(this)
        )
        .subscribe((res) => {
          this.isSelectedConferenceToolAccountPro = res.data;
          this.detector.detectChanges();
        });
      this.conferencingTool.valueChanges.pipe(untilDestroyed(this)).subscribe((_) => {
        this.instructorsControl.markAsDirty();
        this.instructorsControl.updateValueAndValidity();
      });
      this.initFormArray();
    }
  }

  get isRegistrationBeforeStart(): boolean {
    const {
      registrationDeadlineDependsOnEventStartDate,
      registrationPeriodEndDate,
      registrationPeriodEndTime
    } = this.form.getRawValue();
    if (registrationDeadlineDependsOnEventStartDate) {
      return true;
    }

    const eventStartDate = moment(this.iltEvent.classEvent.startDate);
    const endRegistrationTime = this.formatDate(registrationPeriodEndDate, registrationPeriodEndTime);

    return moment(endRegistrationTime).isBefore(eventStartDate);
  }

  openGuide(): void {
    window.open(ZOOM_GUIDE, "_blank", "noopener,noreferrer");
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  onBack(event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.AGENDA));
  }

  onProceed(event: MouseEvent) {
    this.updating = true;
    const formValue = this.form.getRawValue();
    const payload = produce(this.iltEvent, (a: ILTEvent) => {
      if (this.iltEvent.classEvent.virtualVenue) {
        a.externalMeetingType = formValue.conferencingTool;
        a.hierarchicalAgenda.forEach((day: ILTCourseAgendaDay, index: number) => {
          day.externalMeetingEnabled = formValue.sessions[index].enabled;
          if (formValue.conferencingTool === "manual") {
            day.meeting = { joinURL: formValue.sessions[index].link };
          }
        });
        a.automaticAttendanceTracking = formValue.attendanceTracking;
        a.automaticAttendanceCompletion = formValue.completion;
        a.completionRate = formValue.completionPercent;
      } else {
        a.classEvent.venue = { id: formValue.venue };
      }
      if (!this.iltEvent.historical) {
        a.registrationDeadlineDependsOnEventStartDate = formValue.registrationDeadlineDependsOnEventStartDate;
        a.registrationDeadline = this.formatDate(
          formValue.registrationPeriodEndDate,
          formValue.registrationPeriodEndTime
        );
        a.automaticCancellation = this.isRegistrationBeforeStart ? formValue.automaticCancellation : false;
      }
      a.instructors = this.instructorsControl.value.map((i) => {
        return { username: i.username };
      });
    });

    this.store
      .dispatch([new UpdateILTEventDetails(payload, "scheduling")])
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.SUMMARY));
        },
        () => (this.updating = false)
      );
  }

  activateConferencingTool(ct: ConferencingTool) {
    window.location.replace(
      `https://zoom.us/oauth/authorize?response_type=code&client_id=${ct.clientId}&state=create,${this.iltEvent.id}&redirect_uri=${window.location.origin}/hw/admin/zoom-auth-landing`
    );
  }

  openAddVenueModal(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: "Add New Venue",
      nzContent: AddAddressModalComponent,
      nzWrapClassName: "modal-class",
      nzWidth: 660,
      nzComponentParams: {
        countries: this.allCountries
      },
      nzFooter: [
        {
          label: "Cancel",
          type: "text",
          onClick: () => modal.destroy()
        },
        {
          label: "Proceed",
          type: "primary",
          disabled: (d) => !d.form.valid,
          onClick: async (data) => {
            const formValue: Venue = data.form.getRawValue();
            formValue.country = this.allCountries.find((c) => c.key === formValue.country).value;
            return this.adminCourseService
              .addVenue(formValue)
              .toPromise()
              .then((result) => {
                this.venueCountries$ = this.adminCourseService.getILTVenueCountriesDictionary();
                this.countryControl.patchValue(result.country);
                this.cityControl.patchValue(result.city);
                this.venueControl.patchValue(result.id);
                modal.destroy();
              });
          }
        }
      ]
    });
    const instance = modal.getContentComponent();
    setTimeout(() => {
      instance.form
        .get("country")
        .valueChanges.pipe(
        switchMap((val: string) => this.adminCourseService.getStateDictionary(val)),
        untilDestroyed(this)
      )
        .subscribe((res) => {
          instance.form.get("state").patchValue(null);
          instance.states = res;
        });
    }, 200);
  }

  formatDate(date: Date, time: Date): string {
    if (!date || !time) {
      return "N/A";
    }
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
    const day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
    const hours = time.getHours() < 10 ? "0" + time.getHours().toString() : time.getHours().toString();
    const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes().toString() : time.getMinutes().toString();
    const seconds = time.getSeconds() < 10 ? "0" + time.getSeconds().toString() : time.getSeconds().toString();

    return date.getFullYear().toString() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
  }

  get checkLinks(): boolean {
    if (this.iltEvent.classEvent.virtualVenue && this.conferencingTool.value === "manual") {
      if (this.sessions.controls.filter((session) => session.get("enabled").value).length === 0) {
        return true;
      }
      for (const session of this.sessions.controls) {
        if (session.get("enabled").value && !session.get("link").value) {
          return true;
        }
      }
    }
    return false;
  }

  removeInstructor(i: number): void {
    const newVal = [...this.instructorsControl.value];
    newVal.splice(i, 1);
    this.instructorsControl.markAsDirty();
    this.instructorsControl.patchValue(newVal);
  }

  validateInstructors(control: AbstractControl) {
    if (this.conferencingTool.value === "manual" || this.updating === true) {
      this.updating = false;
      return of(null);
    }
    this.updating = true;
    return this.conferencingService
      .checkIfUserIsInAccount(this.conferencingTool.value, control.value[0].username)
      .pipe(
        take(1),
        map((_) => {
          this.updating = false;
          if (!_?.data) {
            return { error: true, conferenceAccount: true };
          } else {
            return null;
          }
        })
      )
      .toPromise();
  }

  openAddInstructorModal(): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: "Add New Instructor",
      nzContent: BasicUserModalComponent,
      nzWrapClassName: "modal-class",
      nzWidth: 660,
      nzComponentParams: {
        userLabel: "Instructor"
      },
      nzFooter: [
        {
          label: "Cancel",
          type: "text",
          onClick: () => modal.destroy()
        },
        {
          label: "Proceed",
          type: "primary",
          disabled: (d) => !d.form.valid,
          onClick: async (data) => {
            const formValue: ILTInstructor = { ...data.form.getRawValue(), source: "ext" };
            let addedInstructor: ILTInstructor;
            return this.adminCourseService
              .addInstructor(formValue)
              .pipe(
                switchMap((inst) => {
                  addedInstructor = inst;
                  return this.adminCourseService.getInstructors();
                })
              )
              .toPromise()
              .then((_) => {
                modal.destroy();
                this.instructors$ = of(_);
                this.instructorsControl.patchValue([...this.instructorsControl.value, addedInstructor]);
              });
          }
        }
      ]
    });
  }
}
