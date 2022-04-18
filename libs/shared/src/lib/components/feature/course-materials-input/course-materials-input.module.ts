import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { MasterInternalRepoTileModule } from "../master-internal-repo-tile/master-internal-repo-tile.module";
import { CourseMaterialsInputComponent } from "./course-materials-input.component";
import { FormLabelModule } from "../../common/form-label/form-label.module";
import { NoMaterialsModule } from "../../common/no-materials/no-materials.module";
import { MaterialRepoToMasterPipe } from "./pipes/material-repo-to-master.pipe";
import { AddCourseMaterialModalModule } from "../../modals/add-course-material-modal/add-course-material-modal.module";
import { VariantSelectModalModule } from "../../modals/variant-select-modal/variant-select-modal.module";

@NgModule({
  declarations: [CourseMaterialsInputComponent, MaterialRepoToMasterPipe],
  exports: [
    CourseMaterialsInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    AddCourseMaterialModalModule,
    VariantSelectModalModule,
    MasterInternalRepoTileModule,
    FormLabelModule,
    NoMaterialsModule,
    InfiniteScrollModule,

    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSpinModule,
  ]
})
export class CourseMaterialsInputModule { }
