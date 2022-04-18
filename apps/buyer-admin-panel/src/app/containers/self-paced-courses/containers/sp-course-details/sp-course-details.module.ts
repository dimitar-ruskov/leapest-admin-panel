import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzTableModule } from "ng-zorro-antd/table";

import { SpCourseDetailsRoutingModule } from "./sp-course-details-routing.module";
import { SpCourseDetailsComponent } from "./sp-course-details.component";
import { SpCourseGeneralInfoComponent } from "./containers/sp-course-general-info/sp-course-general-info.component";
import { SpCourseVariantsComponent } from "./containers/sp-course-variants/sp-course-variants.component";
import {
  SpCourseGeneralDetailsComponent
} from "./containers/sp-course-general-info/sp-course-general-details/sp-course-general-details.component";
import { SpCourseMaterialsComponent } from "./containers/sp-course-materials/sp-course-materials.component";

import {
  MasterInternalRepoTileModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/master-internal-repo-tile/master-internal-repo-tile.module";
import {
  CtaContainerModule
} from "../../../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  GeneralInfoModule
} from "../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import { TGridModule } from "../../../../../../../../libs/shared/src/lib/components/common/t-grid/t-grid.module";
import {
  TableGridModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableSearchModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {
  TableControlPanelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  CourseLxpSettingsModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/course-lxp-settings/course-lxp-settings.module";

@NgModule({
  declarations: [
    SpCourseDetailsComponent,
    SpCourseGeneralInfoComponent,
    SpCourseGeneralDetailsComponent,
    SpCourseVariantsComponent,
    SpCourseMaterialsComponent
  ],
  imports: [
    CommonModule,
    SpCourseDetailsRoutingModule,

    CourseLxpSettingsModule,
    TGridModule,
    CtaContainerModule,
    GeneralInfoModule,
    MasterInternalRepoTileModule,
    TableGridModule,
    TableSearchModule,
    TableControlPanelModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzSkeletonModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzToolTipModule,
    NzMessageModule,
    NzLayoutModule
  ],
})
export class SpCourseDetailsModule {}
