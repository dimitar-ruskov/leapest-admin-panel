import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';

import { AdminCoursesService } from '../../../services/admin-courses.service';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'leap-edit-training-manager-modal',
  templateUrl: './edit-training-manager-modal.component.html',
  styleUrls: ['./edit-training-manager-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTrainingManagerModalComponent implements OnInit, OnDestroy {

  private pendingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get pending$(): Observable<boolean> {
    return this.pendingSubject.asObservable();
  }

  private trainingManagersSubject = new BehaviorSubject<{ id: string, email: string, name: string }[]>([]);

  get trainingManagers$(): Observable<{ id: string, email: string, name: string }[]> {
    return this.trainingManagersSubject.asObservable();
  }

  form: FormGroup= this.fb.group({
    trainingManager: [null, Validators.required]
  });
  trainingManagers: { id: string, email: string, name: string }[];

  @Input() selectedTrainingManager: { id: string, email: string, name: string } | null;

  trainingManagerCompareFn = (
    o1: { id: string, email: string, name: string },
    o2: { id: string, email: string, name: string }
  ) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminCoursesService: AdminCoursesService
  ) {
  
  }

  ngOnInit(): void {
    this.getTrainingManagers();
    this.form.patchValue({
      trainingManager: this.selectedTrainingManager
    });
  }

  ngOnDestroy(): void {
    this.pendingSubject.complete();
    this.trainingManagersSubject.complete();
  }

  private getTrainingManagers(): void {
    this.adminCoursesService.getTrainingManagers().pipe(
      map(t => t.data.map(d => {
        return {
          id: d.employeeId,
          email: d.email,
          name: d.firstName + ' ' + d.lastName
        };
      })),
      take(1)
    ).subscribe((trainingManagers) => {
      this.pendingSubject.next(false);
      this.trainingManagersSubject.next(trainingManagers);
    }, () => this.pendingSubject.next(false));
  }
}
