import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { QuillModule } from "ngx-quill";

import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";

import { SpCourseCreateComponent } from "./sp-course-create.component";
import {
  SpCourseCreateMaterialsComponent
} from "./steps/sp-course-create-materials/sp-course-create-materials.component";
import { SpCourseCreateDetailsComponent } from "./steps/sp-course-create-details/sp-course-create-details.component";
import { SpCourseCreateSummaryComponent } from "./steps/sp-course-create-summary/sp-course-create-summary.component";

import {
  MasterInternalRepoTileModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/master-internal-repo-tile/master-internal-repo-tile.module";
import {
  FormLabelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
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


@NgModule({
  declarations: [
    SpCourseCreateComponent,
    SpCourseCreateMaterialsComponent,
    SpCourseCreateDetailsComponent,
    SpCourseCreateSummaryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: SpCourseCreateComponent
    }]),

    QuillModule,
    CourseMaterialsInputModule,
    MasterInternalRepoTileModule,
    FormLabelModule,
    EditorCharCountModule,
    SelectCategoryInputModule,
    SelectSubCategoryInputModule,
    GeneralInfoModule,
    CreationStepperModule,

    NzSwitchModule,
    NzFormModule,
    NzInputModule,
    NzBreadCrumbModule,
    NzStepsModule,
    NzLayoutModule,
    NzButtonModule,
    NzSpinModule,
    NzSelectModule,
    NzTagModule,
    NzRadioModule,
    NzCollapseModule,
    NzToolTipModule,
    NzIconModule,
    NzCheckboxModule,
  ],
})
export class SpCourseCreateModule {}
