import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, map, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {CourseEventInstructorsCollision, ILTInstructor} from "../../../models/interfaces";
import {
  AdminCoursesService,
  ConferencingToolService,
  CourseEventInstructorsCollisionService
} from "../../../utils/services";

@Component({
  selector: 'leap-edit-instructors-modal',
  templateUrl: './edit-instructors-modal.component.html',
  styleUrls: ['./edit-instructors-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class EditInstructorsModalComponent implements OnInit {
  private readonly pendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get pending$(): Observable<boolean> {
    return this.pendingSubject.asObservable();
  }

  private readonly instructorsSubject = new BehaviorSubject<ILTInstructor[]>([]);

  get instructors$(): Observable<ILTInstructor[]> {
    return this.instructorsSubject.asObservable();
  }

  private readonly instructorCollisionsSubject = new BehaviorSubject<CourseEventInstructorsCollision[]>([]);
  private readonly instructorAccountErrorSubject = new BehaviorSubject<{ data: boolean }>({ data: true });

  get instructorCollisions$(): Observable<CourseEventInstructorsCollision[]> {
    return this.instructorCollisionsSubject.asObservable();
  }

  get instructorAccountErrors$(): Observable<{ data: boolean }> {
    return this.instructorAccountErrorSubject.asObservable();
  }

  instructorAccountError: boolean;

  form: FormGroup = this.fb.group({
    instructors: [null, [Validators.required]],
  });

  @Input() instructors: ILTInstructor[];
  @Input() dates: string[];
  @Input() eventId: string;
  @Input() conferencingTool: string;

  @Output() addInstructor: EventEmitter<void> = new EventEmitter<void>();

  instructorCompareFn = (c1: ILTInstructor, c2: ILTInstructor): boolean => {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService,
    private readonly validationService: CourseEventInstructorsCollisionService,
    private readonly conferencingService: ConferencingToolService,
  ) {}

  ngOnInit(): void {
    this.getInstructors();
    this.form.patchValue({
      instructors: this.instructors,
    });
    this.form
      .get('instructors')
      .valueChanges.pipe(
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
                dates: this.dates,
                eventId: this.eventId,
              })
              .pipe(
                filter((resource) => resource.isSuccess),
                map((resource) => resource.response),
              ),
            this.conferencingTool && this.conferencingTool !== 'manual' && mainInstructorName
              ? this.conferencingService.checkIfUserIsInAccount(this.conferencingTool, mainInstructorName).pipe(take(1))
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

    this.instructorAccountErrors$
      .pipe(untilDestroyed(this))
      .subscribe((instructorAccountErrors) => (this.instructorAccountError = !instructorAccountErrors.data));
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

  validateInstructors(control: AbstractControl) {
    if (!this.conferencingTool || this.conferencingTool === 'manual') {
      return of(null);
    }

    return this.conferencingService
      .checkIfUserIsInAccount(this.conferencingTool, control.value[0])
      .pipe(
        take(1),
        map((instructorAccountErrors) => {
          if (!instructorAccountErrors?.data) {
            return { error: true, conferenceAccount: true };
          } else {
            return null;
          }
        }),
      )
      .toPromise();
  }
}
