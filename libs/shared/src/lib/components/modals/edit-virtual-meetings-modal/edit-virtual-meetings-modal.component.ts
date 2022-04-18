import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TrackByFunction,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, map, switchMap, take } from 'rxjs/operators';
import {
  ConferencingTool,
  CourseEventInstructorsCollision,
  ILTCourseAgendaDay,
  ILTInstructor
} from "../../../models";
import {CustomValidators} from "../../../utils/common";
import {EnvironmentService} from "../../../services/common";
import {
  AdminCoursesService,
  ConferencingToolService,
  CourseEventInstructorsCollisionService
} from "../../../utils/services";

const ZOOM_GUIDE = 'https://edcast-docs.document360.io/v1/docs/web-conferencing-in-edcast-courses-events';

@Component({
  selector: 'leap-edit-virtual-meetings-modal',
  templateUrl: './edit-virtual-meetings-modal.component.html',
  styleUrls: ['./edit-virtual-meetings-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditVirtualMeetingsModalComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    public environmentService: EnvironmentService,
    private readonly validationService: CourseEventInstructorsCollisionService,
    private readonly conferencingService: ConferencingToolService,
    private readonly adminCoursesService: AdminCoursesService,
  ) {}

  private readonly instructorsSubject = new BehaviorSubject<ILTInstructor[]>([]);

  get instructors$(): Observable<ILTInstructor[]> {
    return this.instructorsSubject.asObservable();
  }

  private readonly pendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get pending$(): Observable<boolean> {
    return this.pendingSubject.asObservable();
  }

  private readonly instructorCollisionsSubject = new BehaviorSubject<CourseEventInstructorsCollision[]>([]);
  private readonly instructorAccountErrorSubject = new BehaviorSubject<{ data: boolean }>({ data: true });

  get instructorCollisions$(): Observable<CourseEventInstructorsCollision[]> {
    return this.instructorCollisionsSubject.asObservable();
  }

  get instructorAccountErrors$(): Observable<{ data: boolean }> {
    return this.instructorAccountErrorSubject.asObservable();
  }

  @Input() _hierarchicalAgenda: ILTCourseAgendaDay[];
  @Input() _conferencingTool: string;
  @Input() _instructors: ILTInstructor[];
  @Input() _dates: string[];
  @Input() _eventId: string;
  @Input() _eventIsInProgress: boolean;

  @Output() authConferencingTool: EventEmitter<ConferencingTool> = new EventEmitter<ConferencingTool>();
  @Output() addInstructor: EventEmitter<void> = new EventEmitter<void>();

  @Select(state => state.core.conferencingToolsDictionary)
  conferencingToolsDictionary$: Observable<ConferencingTool[]>;

  form: FormGroup = this.fb.group({
    conferencingTool: [],
    sessions: this.fb.array([]),
    instructors: [null, [Validators.required]],
  });

  instructorAccountError: boolean;

  instructorCompareFn = (c1: ILTInstructor, c2: ILTInstructor): boolean => {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  };

  get sessions(): FormArray {
    return this.form.get('sessions') as FormArray;
  }

  get conferencingToolControl(): FormControl {
    return this.form.get('conferencingTool') as FormControl;
  }

  get instructorsControl(): FormControl {
    return this.form.get('instructors') as FormControl;
  }

  trackByFn: TrackByFunction<FormControl> = (index: number) => index;
  private initFormArray(): void {
    this._hierarchicalAgenda.forEach((day: ILTCourseAgendaDay, index: number) => {
      this.sessions.push(
        this.fb.group({
          enabled: day.externalMeetingEnabled,
          link: [
            {
              value: this._conferencingTool === 'manual' ? day.meeting?.joinURL : '',
              disabled: !day.isEditable,
            },
            [CustomValidators.url],
          ],
          date: day.startDateTime,
          isEditable: day.isEditable,
          index,
        }),
      );
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      conferencingTool: this._conferencingTool,
      instructors: this._instructors,
    });
    this.conferencingToolControl.valueChanges
      .pipe(
        filter((val) => val !== 'manual'),
        switchMap((val) => {
          this.pendingSubject.next(true);
          return this.conferencingService.checkIfUserIsInAccount(val, this.instructorsControl.value[0].username);
        }),
        untilDestroyed(this),
      )
      .subscribe((value) => {
        this.instructorAccountError = !value?.data;
        this.pendingSubject.next(false);
      });
    this.initFormArray();
    this.getInstructors();
    this.instructorsControl.valueChanges
      .pipe(
        concatMap((instructors: ILTInstructor[]) => {
          const instructorIds: string[] =
            instructors && Array.isArray(instructors) && instructors.length
              ? instructors.map((instructor: ILTInstructor) => instructor.id)
              : [];
          const mainInstructorName = instructors?.[0]?.username;
          this.pendingSubject.next(true);
          return forkJoin([
            this.validationService
              .checkForCollision({
                instructors: instructorIds,
                dates: this._dates,
                eventId: this._eventId,
              })
              .pipe(
                filter((resource) => resource.isSuccess),
                map((resource) => resource.response),
              ),
            this.conferencingToolControl && this.conferencingToolControl.value !== 'manual' && mainInstructorName
              ? this.conferencingService
                  .checkIfUserIsInAccount(this.conferencingToolControl.value, mainInstructorName)
                  .pipe(take(1))
              : of({ data: true }),
          ]);
        }),
        untilDestroyed(this),
      )
      .subscribe(
        ([instructorCollision, conferenceAccountError]) => {
          this.instructorCollisionsSubject.next(instructorCollision);
          this.instructorAccountErrorSubject.next(conferenceAccountError);
          this.pendingSubject.next(false);
        },
        () => this.pendingSubject.next(false),
      );

    this.instructorAccountErrors$.pipe(untilDestroyed(this)).subscribe((instructorAccountErrors) => {
      this.instructorAccountError = !instructorAccountErrors.data;
    });
  }

  private getInstructors(): void {
    this.adminCoursesService
      .getInstructors()
      .pipe(take(1))
      .subscribe(
        (trainingManagers) => {
          this.pendingSubject.next(false);
          this.instructorsSubject.next(trainingManagers);
        },
        () => this.pendingSubject.next(false),
      );
  }

  onAddInstructor(event: MouseEvent): void {
    event.stopPropagation();
    this.addInstructor.emit();
  }

  openGuide(): void {
    window.open(ZOOM_GUIDE, '_blank', 'noopener,noreferrer');
  }

  activateConferencingTool(ct: ConferencingTool): void {
    this.authConferencingTool.emit(ct);
  }

  get checkLinks(): boolean {
    if (this.conferencingToolControl.value === 'manual') {
      if (this.sessions.controls.filter((session) => session.get('enabled').value).length === 0) {
        return true;
      }
      for (const session of this.sessions.controls) {
        if (session.get('enabled').value && !session.get('link').value) {
          return true;
        }
      }
    }
    return false;
  }
}
