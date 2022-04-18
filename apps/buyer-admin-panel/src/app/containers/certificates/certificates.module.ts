import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxsModule } from "@ngxs/store";

import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";

import { CertificatesRoutingModule } from "./certificates-routing.module";
import { CertificatesState } from "./state/certificates.state";
import { CertificatesListState } from "./containers/certificates-list/state/certificates-list.state";
import { CertificateDetailsState } from "./containers/certificate-details/state/certificate-details.state";
import {
  CertificateCoursesState
} from "./containers/certificate-details/containers/certificate-courses/state/certificate-courses.state";
import {
  CertificateIssuedState
} from "./containers/certificate-details/containers/certificate-issued/state/certificate-issued.state";
import { CertificatesComponent } from "./certificates.component";
import { CertificatesListComponent } from "./containers/certificates-list/certificates-list.component";
import { CertificateDetailsComponent } from "./containers/certificate-details/certificate-details.component";
import {
  CertificateDetailsInfoComponent
} from "./containers/certificate-details/containers/certificate-details-info/certificate-details-info.component";
import {
  CertificateCoursesComponent
} from "./containers/certificate-details/containers/certificate-courses/certificate-courses.component";
import {
  CertificateIssuedComponent
} from "./containers/certificate-details/containers/certificate-issued/certificate-issued.component";

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
import {
  CertificateViewModule
} from "../../../../../../libs/shared/src/lib/components/feature/certificate-view/certificate-view.module";
import { TableGridModule } from "../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  TextInputModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/text-input-modal/text-input-modal.module";
import {
  EditCertificatePeriodModule
} from "../../../../../../libs/shared/src/lib/components/modals/edit-certificate-period/edit-certificate-period.module";
import {
  CertificateUploadFileModule
} from "../../../../../../libs/shared/src/lib/components/feature/certificate-upload-file/certificate-upload-file.module";
import {
  CertificateCreateModalModule
} from "../../../../../../libs/shared/src/lib/components/modals/certificate-create-modal/certificate-create-modal.module";

@NgModule({
  declarations: [
    CertificatesComponent,
    CertificatesListComponent,
    CertificatesListComponent,
    CertificateDetailsComponent,
    CertificateDetailsInfoComponent,
    CertificateCoursesComponent,
    CertificateIssuedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CertificatesRoutingModule,

    NgxsModule.forFeature([
      CertificatesState,
      CertificatesListState,
      CertificateDetailsState,
      CertificateCoursesState,
      CertificateIssuedState,
    ]),
    GeneralInfoModule,
    CtaContainerModule,
    TGridModule,
    TableGridModule,
    TableControlPanelModule,
    TableSearchModule,
    CertificateViewModule,
    FormLabelModule,
    TextInputModalModule,
    EditCertificatePeriodModule,
    CertificateUploadFileModule,
    CertificateCreateModalModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzFormModule,
    NzInputNumberModule,
    NzSelectModule,
    NzInputModule,
    NzToolTipModule,
    NzEmptyModule,
  ]
})
export class CertificatesModule {}
