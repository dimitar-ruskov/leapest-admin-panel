import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { SpCourseVariantDetailsComponent } from './sp-course-variant-details.component';
import {SpCourseVariantInfoComponent} from "./containers/sp-course-variant-info/sp-course-variant-info.component";
import {SpCourseVariantExamsComponent} from "./containers/sp-course-variant-exams/sp-course-variant-exams.component";
import {
  SpCourseVariantMaterialsTrackingComponent
} from "./containers/sp-course-variant-materials-tracking/sp-course-variant-materials-tracking.component";
import {
  SpCourseVariantLearnersComponent
} from "./containers/sp-course-variant-learners/sp-course-variant-learners.component";
import {
  SpCourseVariantLearnersPendingComponent
} from "./containers/sp-course-variant-learners/tabs/sp-course-variant-learners-pending/sp-course-variant-learners-pending.component";
import {
  SpCourseVariantLearnersEnrolledComponent
} from "./containers/sp-course-variant-learners/tabs/sp-course-variant-learners-enrolled/sp-course-variant-learners-enrolled.component";

import {
  FormLabelModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  GeneralInfoModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {
  NoMaterialsModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/no-materials/no-materials.module";

import {
  InternalRepoTileModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/feature/internal-repo-tile/internal-repo-tile.module";
import {
  EventHeaderSectionsModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/feature/event-header-sections/event-header-sections.module";
import {
  TableControlPanelModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  TableSearchModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";

import {
  CtaContainerModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  CreationStepperModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/common/creation-stepper/creation-stepper.module";
import {TGridModule} from "../../../../../../../../../../../libs/shared/src/lib/components/common/t-grid/t-grid.module";
import {
  GroupMasterInternalReposByTypePipeModule
} from "../../../../../../../../../../../libs/shared/src/lib/utils/pipes/group-master-internal-repos-by-type-pipe/group-master-internal-repos-by-type-pipe.module";
import {
  EditTrainingManagerModalModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-training-manager-modal/edit-training-manager-modal.module";
import {
  EditSelfRegistrationModalModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-self-registration-modal/edit-self-registration-modal.module";
import {
  EditCourseCompletionModalModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/edit-course-completion-modal/edit-course-completion-modal.module";
import {
  AssignUsersModalModule
} from "../../../../../../../../../../../libs/shared/src/lib/components/modals/assign-users-modal/assign-users-modal.module";


@NgModule({
  declarations: [
    SpCourseVariantDetailsComponent,
    SpCourseVariantLearnersComponent,
    SpCourseVariantInfoComponent,
    SpCourseVariantMaterialsTrackingComponent,
    SpCourseVariantExamsComponent,
    SpCourseVariantLearnersPendingComponent,
    SpCourseVariantLearnersEnrolledComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: SpCourseVariantDetailsComponent
    }]),

    CtaContainerModule,
    GeneralInfoModule,
    CreationStepperModule,
    InternalRepoTileModule,
    NoMaterialsModule,
    TGridModule,
    EventHeaderSectionsModule,
    TableControlPanelModule,
    TableSearchModule,
    GroupMasterInternalReposByTypePipeModule,
    FormLabelModule,
    EditTrainingManagerModalModule,
    EditSelfRegistrationModalModule,
    EditCourseCompletionModalModule,
    AssignUsersModalModule,

    NzFormModule,
    NzSkeletonModule,
    NzTabsModule,
    NzLayoutModule,
    NzSpinModule,
    NzSelectModule,
    NzTableModule,
    NzToolTipModule,
    NzButtonModule,
    NzBreadCrumbModule,
  ],
})
export class SpCourseVariantDetailsModule {}
