import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { SpCourseVariantCreateComponent } from './sp-course-variant-create.component';
import {
  SpCourseVariantCreateSummaryComponent
} from "./steps/sp-course-variant-create-summary/sp-course-variant-create-summary.component";
import {CreateVariantModalComponent} from "./modals/create-language-variant-modal/create-variant-modal.component";
import {
  SpCourseVariantCreateDetailsComponent
} from "./steps/sp-course-variant-create-details/sp-course-variant-create-details.component";
import {
  SpCourseVariantCreateMaterialsComponent
} from "./steps/sp-course-variant-create-materials/sp-course-variant-create-materials.component";

import {
  FormLabelModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  CreationStepperModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/creation-stepper/creation-stepper.module";
import {
  NoMaterialsModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/no-materials/no-materials.module";
import {
  GeneralInfoModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {
  InternalRepoTileModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/feature/internal-repo-tile/internal-repo-tile.module";
import {
  CourseMaterialsInputModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/feature/course-materials-input/course-materials-input.module";


@NgModule({
  declarations: [
    SpCourseVariantCreateComponent,
    SpCourseVariantCreateMaterialsComponent,
    SpCourseVariantCreateDetailsComponent,
    SpCourseVariantCreateSummaryComponent,
    CreateVariantModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: SpCourseVariantCreateComponent
    }]),

    FormLabelModule,
    CreationStepperModule,
    InternalRepoTileModule,
    NoMaterialsModule,
    GeneralInfoModule,
    CourseMaterialsInputModule,

    NzSkeletonModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzLayoutModule,
    NzStepsModule,
    NzSpinModule,
    NzRadioModule,
    NzSwitchModule,
    NzToolTipModule,
    NzButtonModule,
    NzCollapseModule,
    NzBreadCrumbModule,
  ]
})
export class SpCourseVariantCreateModule { }
