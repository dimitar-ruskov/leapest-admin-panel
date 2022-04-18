import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NzTableModule } from "ng-zorro-antd/table";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";

import { SpCoursesListComponent } from "./sp-courses-list.component";
import { DraftSpCoursesListComponent } from "./draft-sp-courses-list/draft-sp-courses-list.component";
import { ActiveSpCoursesListComponent } from "./active-sp-courses-list/active-sp-courses-list.component";

import {
  TableSearchModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {
  CtaContainerModule
} from "../../../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  TableGridModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";

@NgModule({
  declarations: [
    SpCoursesListComponent,
    ActiveSpCoursesListComponent,
    DraftSpCoursesListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: SpCoursesListComponent
    }]),

    CtaContainerModule,
    TableGridModule,
    TableSearchModule,
    TableControlPanelModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzLayoutModule,
    NzToolTipModule
  ],
})
export class SpCoursesListModule {}
