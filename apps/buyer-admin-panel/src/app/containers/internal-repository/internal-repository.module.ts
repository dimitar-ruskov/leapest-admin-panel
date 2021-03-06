import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzModalModule } from "ng-zorro-antd/modal";

import { InternalRepositoryRoutingModule } from "./internal-repository-routing.module";
import { InternalRepositoryComponent } from "./internal-repository.component";
import { InternalRepositoryState } from "./state/internal-repository.state";
import {
  InternalRepositoryListComponent
} from "./containers/internal-repository-list/internal-repository-list.component";
import {
  InternalRepositoryListState
} from "./containers/internal-repository-list/state/internal-repository-list.state";
import {
  InternalRepositoryDetailsComponent
} from "./containers/internal-repository-details/internal-repository-details.component";
import {
  InternalRepositoryDetailsInfoComponent
} from "./containers/internal-repository-details/containers/internal-repository-details-info/internal-repository-details-info.component";
import {
  InternalRepositoryDetailsVariantsComponent
} from "./containers/internal-repository-details/containers/internal-repository-details-variants/internal-repository-details-variants.component";
import {
  InternalRepositoryDetailsCoursesComponent
} from "./containers/internal-repository-details/containers/internal-repository-details-courses/internal-repository-details-courses.component";
import {
  InternalRepositoryDetailsState
} from "./containers/internal-repository-details/state/internal-repository-details.state";
import {
  InternalRepositoryVariantsState
} from "./containers/internal-repository-details/containers/internal-repository-details-variants/state/internal-repository-variants.state";
import {
  InternalRepositoryCoursesState
} from "./containers/internal-repository-details/containers/internal-repository-details-courses/state/internal-repository-courses.state";

import {
  TableSearchModule
} from "../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import { FormLabelModule } from "../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  CtaContainerModule
} from "../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  GeneralInfoModule
} from "../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import { TGridModule } from "../../../../../../libs/shared/src/lib/components/common/t-grid/t-grid.module";
import { TableGridModule } from "../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  TextInputModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/text-input-modal/text-input-modal.module";
import {
  QuillInputModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/quill-input-modal/quill-input-modal.module";
import {
  EditPassRateModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/edit-pass-rate-modal/edit-pass-rate-modal.module";
import {
  CreationLoaderModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/creation-loader-modal/creation-loader-modal.module";
import {
  EditInternalRepoNameModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/edit-internal-repo-name-modal/edit-internal-repo-name-modal.module";
import {
  InternalRepositoryCreateModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/internal-repository-create-modal/internal-repository-create-modal.module";

@NgModule({
  declarations: [
    InternalRepositoryComponent,
    InternalRepositoryListComponent,
    InternalRepositoryDetailsComponent,
    InternalRepositoryDetailsInfoComponent,
    InternalRepositoryDetailsVariantsComponent,
    InternalRepositoryDetailsCoursesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InternalRepositoryRoutingModule,

    NgxsModule.forFeature([
      InternalRepositoryState,
      InternalRepositoryListState,
      InternalRepositoryDetailsState,
      InternalRepositoryVariantsState,
      InternalRepositoryCoursesState,
    ]),
    GeneralInfoModule,
    TGridModule,
    CtaContainerModule,
    TableGridModule,
    TableSearchModule,
    TableControlPanelModule,
    FormLabelModule,

    TextInputModalModule,
    QuillInputModalModule,
    EditPassRateModalModule,
    EditInternalRepoNameModalModule,
    CreationLoaderModalModule,
    GeneralInfoModule,
    InternalRepositoryCreateModalModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzUploadModule,
    NzDropDownModule,
    NzToolTipModule,
    NzModalModule
  ]
})
export class InternalRepositoryModule {}
