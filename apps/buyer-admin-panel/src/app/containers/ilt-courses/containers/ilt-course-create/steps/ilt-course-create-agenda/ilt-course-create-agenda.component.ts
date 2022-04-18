import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import produce from "immer";

import { GoToILTCourseCreationStep, UpdatePreILTCourse } from "../../state/ilt-course-create.actions";
import {
  ILTCourse,
  ILTCourseAgenda,
  ILTCourseCreationStep,
  PreILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models";

@Component({
  selector: 'leap-ilt-course-create-agenda',
  templateUrl: './ilt-course-create-agenda.component.html',
  styleUrls: ['./ilt-course-create-agenda.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseCreateAgendaComponent implements OnInit {
  updating: boolean;
  agendaValueAndValidity: { valid: boolean; value: ILTCourseAgenda };
  agendaEditable = false;

  @Input() preCourse: PreILTCourse;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.agendaEditable = !!this.preCourse.expressCourse.agendaEditable;
  }

  onAgendaValueAndValidityChange(agendaValueAndValidity: { valid: boolean; value: ILTCourseAgenda }): void {
    this.agendaValueAndValidity = agendaValueAndValidity;
  }

  onBack(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(new GoToILTCourseCreationStep({ step: ILTCourseCreationStep.DETAILS }));
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();
    const payload = produce(this.preCourse, (a: ILTCourse) => {
      a.expressCourse.agenda = this.agendaValueAndValidity.value.days;
      a.expressCourse.agendaEditable = this.agendaEditable;
    });

    this.updating = true;
    this.store
      .dispatch(new UpdatePreILTCourse({ updatedCourse: payload, step: ILTCourseCreationStep.AGENDA }))
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToILTCourseCreationStep({ step: ILTCourseCreationStep.SUMMARY }));
        },
        () => (this.updating = false),
      );
  }
}
