import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from "@angular/router";
import { QuillModule } from 'ngx-quill';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { IltCourseCreateComponent } from './ilt-course-create.component';
import { IltCourseCreateMaterialsComponent } from './steps/ilt-course-create-materials/ilt-course-create-materials.component';
import { IltCourseCreateDetailsComponent } from './steps/ilt-course-create-details/ilt-course-create-details.component';
import { IltCourseCreateAgendaComponent } from './steps/ilt-course-create-agenda/ilt-course-create-agenda.component';
import { IltCourseCreateSummaryComponent } from './steps/ilt-course-create-summary/ilt-course-create-summary.component';

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
  GeneralInfoModule
} from "../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {
  CourseMaterialsInputModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/course-materials-input/course-materials-input.module";
import {TAgendaModule} from "../../../../../../../../libs/shared/src/lib/components/feature/t-agenda/t-agenda.module";
import {
  CertificateSelectModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/certificate-select/certificate-select.module";

@NgModule({
  declarations: [
    IltCourseCreateComponent,
    IltCourseCreateMaterialsComponent,
    IltCourseCreateDetailsComponent,
    IltCourseCreateAgendaComponent,
    IltCourseCreateSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: IltCourseCreateComponent
    }]),

    QuillModule,
    CreationStepperModule,
    FormLabelModule,
    EditorCharCountModule,
    SelectCategoryInputModule,
    SelectSubCategoryInputModule,
    CourseMaterialsInputModule,
    MasterInternalRepoTileModule,
    TAgendaModule,
    GeneralInfoModule,
    CertificateSelectModule,

    NzRadioModule,
    NzToolTipModule,
    NzIconModule,
    NzInputModule,
    NzStepsModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzSpinModule,
    NzCollapseModule,
    NzLayoutModule,
    NzCheckboxModule,
    NzSelectModule,
    NzTagModule,
    NzButtonModule,
    NzFormModule,
    NzInputNumberModule,
  ]
})
export class IltCourseCreateModule {}
