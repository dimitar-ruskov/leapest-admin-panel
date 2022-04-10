import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { IltCoursesListComponent } from './ilt-courses-list.component';
import { PublishedIltCoursesListComponent } from './published-ilt-courses-list/published-ilt-courses-list.component';
import { DraftIltCoursesListComponent } from './draft-ilt-courses-list/draft-ilt-courses-list.component';

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
import {
  EventCreateModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/event-create-modal/event-create-modal.module";
import {
  CreateNewCourseModalModule
} from "../../../../../../../../libs/shared/src/lib/components/modals/create-new-course-modal/create-new-course-modal.module";


@NgModule({
  declarations: [
    IltCoursesListComponent,
    PublishedIltCoursesListComponent,
    DraftIltCoursesListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: IltCoursesListComponent
    }]),

    CtaContainerModule,
    TableControlPanelModule,
    TableSearchModule,
    TableGridModule,
    EventCreateModalModule,
    CreateNewCourseModalModule,

    NzButtonModule,
    NzLayoutModule,
    NzTabsModule,
    NzTableModule,
    NzToolTipModule,
  ]
})
export class IltCoursesListModule { }
