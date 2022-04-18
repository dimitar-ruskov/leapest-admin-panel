import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { IltEventsCreateComponent } from './ilt-events-create.component';
import { IltEventCreateMaterialsStepComponent } from './steps/ilt-event-create-materials-step/ilt-event-create-materials-step.component';
import { IltEventCreateDetailsStepComponent } from './steps/ilt-event-create-details-step/ilt-event-create-details-step.component';
import { IltEventCreateAgendaStepComponent } from './steps/ilt-event-create-agenda-step/ilt-event-create-agenda-step.component';
import { IltEventCreateSummaryStepComponent } from './steps/ilt-event-create-summary-step/ilt-event-create-summary-step.component';
import { IltEventCreateSchedulingStepComponent } from './steps/ilt-event-create-scheduling-step/ilt-event-create-scheduling-step.component';
import { FlattenedCourseInfoModule } from '../../../../../../../../libs/shared/src/lib/components/feature/flattened-course-info/flattened-course-info.module';
import { EventDetailsInfoModule } from '../../../../../../../../libs/shared/src/lib/components/feature/event-details-info/event-details-info.module';

import {
  FormLabelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  MasterInternalRepoTileModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/master-internal-repo-tile/master-internal-repo-tile.module";
import {
  SelectCategoryInputModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/select-category-input/select-category-input.module";
import {
  SelectSubCategoryInputModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/select-sub-category-input/select-sub-category-input.module";
import {
  CreationStepperModule
} from "../../../../../../../../libs/shared/src/lib/components/common/creation-stepper/creation-stepper.module";
import {
  EditorCharCountModule
} from "../../../../../../../../libs/shared/src/lib/components/common/editor-char-count/editor-char-count.module";
import {
  NoMaterialsModule
} from "../../../../../../../../libs/shared/src/lib/components/common/no-materials/no-materials.module";
import {
  InternalRepoTileModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/internal-repo/internal-repo-tile/internal-repo-tile.module";
import {
  EditCourseCertificateModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/edit-course-certificate/edit-course-certificate.module";
import {
  CourseMaterialsInputModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/course-materials-input/course-materials-input.module";
import {TAgendaModule} from "../../../../../../../../libs/shared/src/lib/components/feature/t-agenda/t-agenda.module";
import {
  BasicUserModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/basic-user-modal/basic-user-modal.module";
import {
  AddAddressModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/add-address-modal/add-address-modal.module";

@NgModule({
  declarations: [
    IltEventsCreateComponent,
    IltEventCreateMaterialsStepComponent,
    IltEventCreateDetailsStepComponent,
    IltEventCreateAgendaStepComponent,
    IltEventCreateSummaryStepComponent,
    IltEventCreateSchedulingStepComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: IltEventsCreateComponent
    }]),

    QuillModule,
    FlattenedCourseInfoModule,
    EventDetailsInfoModule,
    EditorCharCountModule,
    SelectCategoryInputModule,
    SelectSubCategoryInputModule,
    FormLabelModule,
    CreationStepperModule,
    MasterInternalRepoTileModule,
    CourseMaterialsInputModule,
    TAgendaModule,
    InternalRepoTileModule,
    NoMaterialsModule,
    EditCourseCertificateModule,
    BasicUserModalModule,
    AddAddressModalModule,

    NzStepsModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzSelectModule,
    NzTagModule,
    NzButtonModule,
    NzFormModule,
    NzToolTipModule,
    NzSpinModule,
    NzInputModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSwitchModule,
    NzUploadModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzCollapseModule,
    NzSkeletonModule,
    NzLayoutModule,
    NzCheckboxModule,
  ],
})
export class IltEventsCreateModule {}
