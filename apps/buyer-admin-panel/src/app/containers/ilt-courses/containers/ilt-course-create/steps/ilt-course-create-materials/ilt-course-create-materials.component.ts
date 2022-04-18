import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import produce, { Draft } from 'immer';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ILTCourseCreationStep } from '../../../../../../../../../../libs/shared/src/lib/models/courses/ilt-courses/ilt-course-create-step.model';
import { IltCoursesService } from '../../../../../../../../../../libs/shared/src/lib/services/courses/ilt-courses/ilt-courses.service';
import { GoToILTCourseCreationStep, UpdatePreILTCourse } from '../../state/ilt-course-create.actions';
import {IGlobalStateModel} from "../../../../../../state/state.model";

import {
  IConfigCertificatesDictionary, ILTCourse,
  InternalRepositoryMaterial, PreILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models";
import {AdminCoursesService} from "../../../../../../../../../../libs/shared/src/lib/utils/services";

@Component({
  selector: 'leap-ilt-course-create-materials',
  templateUrl: './ilt-course-create-materials.component.html',
  styleUrls: ['./ilt-course-create-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseCreateMaterialsComponent implements OnInit {
  @Input() preCourse: PreILTCourse;

  @Select((state: IGlobalStateModel) => state.core.certificatesDictionary)
  certificatesDictionary$: Observable<IConfigCertificatesDictionary[]>;

  form: FormGroup;
  updating: boolean;
  noLearnerMaterialsLabel = 'This course has no learner materials yet.';
  noInstructorMaterialsLabel = 'This course has no instructor materials yet.';

  constructor(
    private readonly service: AdminCoursesService,
    private readonly coursesILTService: IltCoursesService,
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly detector: ChangeDetectorRef,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      internalRepositories: this.fb.group({
        learner: [[]],
        instructor: [[]],
      }),
      certificate: [],
    });

    const existingMaterials = this.preCourse.expressCourse.existingMaterials;
    const existingCertificate = this.preCourse.participationCertificate;

    if (existingMaterials && Array.isArray(existingMaterials) && existingMaterials.length) {
      const internalRepositories = {
        learner: [],
        instructor: [],
      };

      existingMaterials.forEach((material: InternalRepositoryMaterial) => {
        const userType = material?.userType?.configKey;

        if (userType) {
          internalRepositories[userType].push(material);
        }
      });

      this.form.patchValue({
        internalRepositories,
      });
    }

    if (existingCertificate) {
      this.form.patchValue({
        certificate: existingCertificate.id,
      });
    }
  }

  onProceed(event: MouseEvent): void {
    event.stopPropagation();
    const { internalRepositories, certificate } = this.form.getRawValue();
    const payload = produce(this.preCourse, (draft: Draft<ILTCourse>) => {
      draft.expressCourse.existingMaterials = [
        ...internalRepositories.learner.map((material) => ({ ...material, userType: { configKey: 'learner' } })),
        ...internalRepositories.instructor.map((material) => ({ ...material, userType: { configKey: 'instructor' } })),
      ];
      draft.participationCertificate = certificate ? { id: certificate } : null;
    });

    this.updating = true;
    this.store
      .dispatch(new UpdatePreILTCourse({ updatedCourse: payload, step: ILTCourseCreationStep.MATERIALS }))
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToILTCourseCreationStep({ step: ILTCourseCreationStep.DETAILS }));
        },
        () => (this.updating = false),
      );
  }

  onCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['admin', 'ilt-courses']);
  }
}
