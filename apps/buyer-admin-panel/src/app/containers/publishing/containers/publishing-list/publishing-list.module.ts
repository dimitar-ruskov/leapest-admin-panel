import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzIconModule} from "ng-zorro-antd/icon";

import { PublishingListComponent } from './publishing-list.component';
import { PublishingSettingsComponent } from './containers/publishing-settings/publishing-settings.component';
import { PublishingInternalRepositoryComponent } from './containers/publishing-internal-repository/publishing-internal-repository.component';

import {
  TableSearchModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-search/table-search.module";
import {
  FormLabelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/form-label/form-label.module";
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
  declarations: [PublishingListComponent, PublishingSettingsComponent, PublishingInternalRepositoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: PublishingListComponent
    }]),

    CtaContainerModule,
    TableControlPanelModule,
    TableSearchModule,
    TableGridModule,
    FormLabelModule,

    NzLayoutModule,
    NzTabsModule,
    NzTableModule,
    NzToolTipModule,
    NzFormModule,
    NzSelectModule,
    NzRadioModule,
    NzInputNumberModule,
    NzButtonModule,
    NzInputModule,
    NzTagModule,
    NzIconModule
  ]
})
export class PublishingListModule {}
