import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  InternalRepositoryMaterial,
  PublishedILTCourse
} from "../../../../../../../../../../libs/shared/src/lib/models";

export type ButtonState = 'loading' | 'active' | 'disabled';

@Component({
  selector: 'leap-ilt-course-materials',
  templateUrl: './ilt-course-materials.component.html',
  styleUrls: ['./ilt-course-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IltCourseMaterialsComponent implements OnInit {
  public noLearnerMaterialsLabel = 'This course has no learner materials yet.';
  public noInstructorMaterialsLabel = 'This course has no instructor materials yet.';
  public form: FormGroup;

  public get internalRepositories(): FormGroup {
    return this.form.get('internalRepositories') as FormGroup;
  }

  @Input() iltCourse: PublishedILTCourse;
  @Input() showSaveChanges: ButtonState;

  @Output() valueChange: EventEmitter<{
    changed: boolean;
    value: {
      learner: [];
      instructor: [];
    };
  }> = new EventEmitter();

  @Output() saveChanges: EventEmitter<void> = new EventEmitter();

  constructor(private readonly modalService: NzModalService, private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      internalRepositories: this.fb.group({
        learner: [],
        instructor: [],
      }),
    });

    this.initMaterials();
    this.emitMaterialsValue(false);

    this.internalRepositories.valueChanges.pipe(untilDestroyed(this)).subscribe((res) => {
      this.emitMaterialsValue();
    });
  }

  onSaveChanges(): void {
    this.saveChanges.emit();
  }

  private emitMaterialsValue(changed = true): void {
    const value = this.internalRepositories.value;
    if (value) {
      this.valueChange.emit({
        changed,
        value,
      });
    }
  }

  private initMaterials(): void {
    const { masterInternalRepositories, marketplaceMaterials } = this.iltCourse;

    const internalRepositories = {
      learner: [],
      instructor: [],
    };

    const fillMaterials = (isExist = false, isMarketplaceMaterial = false) => (
      material: InternalRepositoryMaterial,
    ) => {
      const userType = material?.userType?.configKey;
      const extendedMaterial = { ...material, isExist, isMarketplaceMaterial };
      if (userType) {
        internalRepositories[userType].push(extendedMaterial);
      }
    };

    if (masterInternalRepositories && Array.isArray(masterInternalRepositories) && masterInternalRepositories.length) {
      masterInternalRepositories.forEach(fillMaterials(true, false));
    }
    if (marketplaceMaterials && Array.isArray(marketplaceMaterials) && marketplaceMaterials.length) {
      marketplaceMaterials.forEach(fillMaterials(true, true));
    }

    this.form.patchValue({
      internalRepositories,
    });
  }
}
