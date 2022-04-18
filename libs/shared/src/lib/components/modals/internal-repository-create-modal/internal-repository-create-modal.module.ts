import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzButtonModule} from "ng-zorro-antd/button";

import {InternalRepositoryCreateModalComponent} from "./internal-repository-create-modal.component";
import {
  InternalRepoHostedModalComponent
} from "./steps/internal-repo-hosted-modal/internal-repo-hosted-modal.component";
import {InternalRepoTypeModalComponent} from "./steps/internal-repo-type-modal/internal-repo-type-modal.component";
import {
  InternalRepoExternalModalComponent
} from "./steps/internal-repo-external-modal/internal-repo-external-modal.component";

import {
  TypeTileModule
} from "../../feature/type-tile/type-tile.module";
import {
  FormLabelModule
} from "../../common/form-label/form-label.module";


const modals = [
  InternalRepositoryCreateModalComponent,
  InternalRepoHostedModalComponent,
  InternalRepoTypeModalComponent,
  InternalRepoExternalModalComponent
];

@NgModule({
  declarations: [modals],
  exports: [modals],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    TypeTileModule,

    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDropDownModule,
    NzUploadModule,
    NzStepsModule,
    NzButtonModule,
  ]
})

export class InternalRepositoryCreateModalModule {}
