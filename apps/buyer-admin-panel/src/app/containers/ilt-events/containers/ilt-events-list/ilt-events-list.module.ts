import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NzButtonModule } from "ng-zorro-antd/button";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";

import { IltEventsListComponent } from "./ilt-events-list.component";
import { DraftIltEventsListComponent } from "./draft-ilt-events-list/draft-ilt-events-list.component";
import { ActiveIltEventsListComponent } from "./active-ilt-events-list/active-ilt-events-list.component";
import { FinishedIltEventsListComponent } from "./finished-ilt-events-list/finished-ilt-events-list.component";

import {
  TableSearchModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {
  CtaContainerModule
} from "../../../../../../../../libs/shared/src/lib/components/common/cta-container/cta-container.module";
import {
  TableControlPanelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  TableGridModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";


@NgModule({
  declarations: [
    IltEventsListComponent,
    DraftIltEventsListComponent,
    ActiveIltEventsListComponent,
    FinishedIltEventsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: IltEventsListComponent
    }]),

    CtaContainerModule,
    TableControlPanelModule,
    TableSearchModule,
    TableGridModule,

    NzButtonModule,
    NzLayoutModule,
    NzTabsModule,
    NzTableModule,
    NzToolTipModule,
    NzBadgeModule,
    NzEmptyModule,
    NzDatePickerModule,
  ],
})
export class IltEventsListModule { }
