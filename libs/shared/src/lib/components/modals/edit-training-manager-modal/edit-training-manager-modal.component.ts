import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {ITrainingManager} from "../../../models/interfaces";
import {AdminCoursesService} from "../../../utils/services";


@Component({
  selector: 'leap-edit-training-manager-modal',
  templateUrl: './edit-training-manager-modal.component.html',
  styleUrls: ['./edit-training-manager-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTrainingManagerModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    trainingManagers: [],
  });

  trainingManagers$: Observable<ITrainingManager[]>;

  @Input() selectedTrainingManagers: ITrainingManager[];

  tmCompareFn = (c1: ITrainingManager, c2: ITrainingManager): boolean => {
    return c1 && c2 ? c1.trainingManagerId === c2.trainingManagerId : c1 === c2;
  };

  constructor(private readonly fb: FormBuilder, private readonly adminCoursesService: AdminCoursesService) {}

  ngOnInit(): void {
    this.getTrainingManagers();
    this.form.patchValue({
      trainingManagers: this.selectedTrainingManagers,
    });
    this.form.get('trainingManagers').setValidators(Validators.required);
  }

  private getTrainingManagers(): void {
    this.trainingManagers$ = this.adminCoursesService.getTrainingManagers().pipe(
      map((t) =>
        t.data.map((d) => {
          const tm = {
            trainingManagerEmail: d.email,
            trainingManagerId: d.employeeId,
            trainingManagerName: d.firstName + ' ' + d.lastName,
          };
          return tm;
        }),
      ),
    );
  }
}
