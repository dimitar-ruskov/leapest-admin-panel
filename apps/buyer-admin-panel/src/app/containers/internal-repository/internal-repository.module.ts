import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InternalRepositoryRoutingModule } from './internal-repository-routing.module';
import { InternalRepositoryComponent } from './internal-repository.component';
import { InternalRepositoryListComponent } from './containers/internal-repository-list/internal-repository-list.component';
import { InternalRepositoryListState } from './state/internal-repository-list/internal-repository-list.state';
import { InternalRepositoryDetailsComponent } from './containers/internal-repository-details/internal-repository-details.component';
import { InternalRepositoryDetailsInfoComponent } from './containers/internal-repository-details/containers/internal-repository-details-info/internal-repository-details-info.component';
import { InternalRepositoryDetailsVariantsComponent } from './containers/internal-repository-details/containers/internal-repository-details-variants/internal-repository-details-variants.component';
import { InternalRepositoryDetailsCoursesComponent } from './containers/internal-repository-details/containers/internal-repository-details-courses/internal-repository-details-courses.component';
import { InternalRepositoryDetailsState } from './state/internal-repository-details/internal-repository-details.state';
import { InternalRepositoryVariantsState } from './state/internal-repository-details/internal-repository-variants.state';
import { InternalRepositoryCoursesState } from './state/internal-repository-details/internal-repository-courses.state';
import { InternalRepositoryCreateModalComponent } from './containers/internal-repository-create-modal/internal-repository-create-modal.component';
import { InternalRepoHostedModalComponent } from './containers/internal-repository-create-modal/steps/internal-repo-hosted-modal/internal-repo-hosted-modal.component';
import { InternalRepoTypeModalComponent } from './containers/internal-repository-create-modal/steps/internal-repo-type-modal/internal-repo-type-modal.component';
import { InternalRepoExternalModalComponent } from './containers/internal-repository-create-modal/steps/internal-repo-external-modal/internal-repo-external-modal.component';

import {
  TableSearchModule
} from "../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {FormLabelModule} from "../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
import {
  CtaContainerModule
} from "../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  GeneralInfoModule
} from "../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {TGridModule} from "../../../../../../libs/shared/src/lib/components/common/t-grid/t-grid.module";
import {TableGridModule} from "../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  declarations: [
    InternalRepositoryComponent,
    InternalRepositoryListComponent,
    InternalRepositoryDetailsComponent,
    InternalRepositoryDetailsInfoComponent,
    InternalRepositoryDetailsVariantsComponent,
    InternalRepositoryDetailsCoursesComponent,
    InternalRepositoryCreateModalComponent,
    InternalRepoHostedModalComponent,
    InternalRepoTypeModalComponent,
    InternalRepoExternalModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InternalRepositoryRoutingModule,

    NgxsModule.forFeature([
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
    NzStepsModule,
  ]
})
export class InternalRepositoryModule {}
