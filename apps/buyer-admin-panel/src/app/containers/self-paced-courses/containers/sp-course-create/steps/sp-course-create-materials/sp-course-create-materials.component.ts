import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import produce from "immer";

import {
  CancelSPCourseCreation,
  GoToSPCourseCreationStep,
  UpdatePreSelfPacedCourse
} from "../../state/sp-course-create.actions";
import { PreSelfPacedCourse, SPCourseCreationSteps } from "../../../../../../../../../../libs/shared/src/lib/models";

const NO_MATERIALS_LABEL = 'This course has no materials yet. Please add your material, in order to continue';

@Component({
  selector: 'leap-sp-course-create-materials',
  templateUrl: './sp-course-create-materials.component.html',
  styleUrls: ['./sp-course-create-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SpCourseCreateMaterialsComponent implements OnInit {
  updating: boolean;
  noMaterialsLabel = NO_MATERIALS_LABEL;
  form: FormGroup;

  @Input() preSelfPacedCourse: PreSelfPacedCourse;

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    this.form = this.fb.group({
      internalRepositories: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.patchValue({ internalRepositories: this.preSelfPacedCourse.expressCourse?.existingMaterials });
  }


  onCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(new CancelSPCourseCreation());
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();
    const updatedCourse = produce(this.preSelfPacedCourse, (details: PreSelfPacedCourse) => {
      details.expressCourse.existingMaterials = [...this.form.value.internalRepositories];
    });

    this.updating = true;
    this.store
      .dispatch(
        new UpdatePreSelfPacedCourse({
          updatedCourse,
          step: SPCourseCreationSteps.MATERIALS,
        }),
      )
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToSPCourseCreationStep({ step: SPCourseCreationSteps.DETAILS }));
        },
        () => (this.updating = false),
      );
  }
}
