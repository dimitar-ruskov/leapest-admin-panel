import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Draft, produce } from 'immer';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ILTEventCreationStep } from '../../models/ilt-event-create-step.model';
import { GoToEventCreationStep, UpdateILTEventDetails } from '../../state/ilt-events-create.actions';
import {IGlobalStateModel} from "../../../../../../state/state.model";

import {
  IConfigCertificatesDictionary,
  ILTEvent,
  InternalRepositoryMaterial
} from "../../../../../../../../../../libs/shared/src/lib/models/interfaces";
import {
  EditCourseCertificateComponent
} from "../../../../../../../../../../libs/shared/src/lib/components/feature/edit-course-certificate/edit-course-certificate.component";
import {
  MaterialDtoHandlerService
} from "../../../../../../../../../../libs/shared/src/lib/utils/services/material-dto-handler.service";

@Component({
  selector: 'leap-ilt-event-create-materials-step',
  templateUrl: './ilt-event-create-materials-step.component.html',
  styleUrls: ['./ilt-event-create-materials-step.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MaterialDtoHandlerService],
})
@UntilDestroy()
export class IltEventCreateMaterialsStepComponent implements OnInit {
  @Input() iltEvent: ILTEvent;
  public form: FormGroup;
  public updating = false;
  public noLearnerMaterialsLabel = 'This course has no learner materials yet.';
  public noInstructorMaterialsLabel = 'This course has no instructor materials yet.';
  public certificatesList: IConfigCertificatesDictionary[];

  @ViewChild('editCertificate') editCertificate: EditCourseCertificateComponent;
  @Select((state: IGlobalStateModel) => state.core.certificatesDictionary)
  certificatesDictionary$: Observable<IConfigCertificatesDictionary[]>;

  constructor(
    private readonly modalService: NzModalService,
    private readonly router: Router,
    private readonly materialDTOHandler: MaterialDtoHandlerService,
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly detector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      internalRepositories: this.fb.group({
        learner: [],
        instructor: [],
        certificate: [],
      }),
    });

    this.initMaterials();
    this.certificatesDictionary$
      .pipe(untilDestroyed(this))
      .subscribe((certificatesList: IConfigCertificatesDictionary[]) => {
        this.certificatesList = certificatesList;
        this.detector.markForCheck();
      });
  }

  private initMaterials(): void {
    const {
      masterInternalRepositories,
      additionalMasterInternalRepositories,
      marketplaceMaterials,
    } = this.iltEvent.course;
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

    additionalMasterInternalRepositories.forEach(fillMaterials());

    this.form.patchValue({
      internalRepositories,
    });
  }

  public onCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['admin', 'ilt-events']);
  }

  public onProceed(event: MouseEvent): void {
    event.stopPropagation();
    const { internalRepositories } = this.form.getRawValue();
    const materials = {
      masterInternalRepositories: [],
      additionalMasterInternalRepositories: [],
      marketplaceMaterials: [],
    };

    const updateRepositories = (irm: InternalRepositoryMaterial, index: number, userType: 'learner' | 'instructor') => {
      const ir = { ...irm };
      if (!ir.userType) {
        ir.userType = { configKey: userType };
      }
      ir.isAdditional = !ir.isExist;
      ir.indexNumber = index;
      ir.isMarketplaceMaterial
        ? materials.marketplaceMaterials.push(ir)
        : materials.masterInternalRepositories.push(ir);
    };

    internalRepositories.learner?.forEach((irm: InternalRepositoryMaterial, index: number) =>
      updateRepositories(irm, index, 'learner'),
    );
    internalRepositories.instructor?.forEach((irm: InternalRepositoryMaterial, index: number) =>
      updateRepositories(irm, index, 'instructor'),
    );

    const updatedIltEvent = produce(this.iltEvent, (draft: Draft<ILTEvent>) => {
      draft.course.masterInternalRepositories = materials.masterInternalRepositories;
      draft.course.additionalMasterInternalRepositories = materials.additionalMasterInternalRepositories;
      draft.course.marketplaceMaterials = materials.marketplaceMaterials;
      draft.participationCertificateEnabled = !!this.editCertificate?.isEnabled;
    });

    this.updating = true;
    this.store
      .dispatch(new UpdateILTEventDetails(updatedIltEvent, 'materials'))
      .pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.updating = false;
          this.store.dispatch(new GoToEventCreationStep(ILTEventCreationStep.DETAILS));
        },
        () => (this.updating = false),
      );
  }
}
