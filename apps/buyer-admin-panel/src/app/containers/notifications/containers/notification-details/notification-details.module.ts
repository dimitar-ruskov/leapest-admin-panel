import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NotificationDetailsComponent } from './notification-details.component';

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
  GeneralInfoModule
} from "../../../../../../../../libs/shared/src/lib/components/common/general-info/general-info.module";
import {
  CertificateViewModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/certificate-view/certificate-view.module";
import {TAgendaModule} from "../../../../../../../../libs/shared/src/lib/components/feature/t-agenda/t-agenda.module";
import {
  CertificatePreviewModule
} from "../../../../../../../../libs/shared/src/lib/components/feature/certificate-preview/certificate-preview.module";
import {
  TableControlPanelModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-control-panel/table-control-panel.module";
import {
  TableGridModule
} from "../../../../../../../../libs/shared/src/lib/components/common/table-grid/table-grid.module";

@NgModule({
  declarations: [NotificationDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
        path: '',
        component: NotificationDetailsComponent
      }]),

    GeneralInfoModule,
    FormLabelModule,
    TableControlPanelModule,
    TableSearchModule,
    CtaContainerModule,
    TableGridModule,
    TAgendaModule,
    CertificateViewModule,
    CertificatePreviewModule,
    // TemplateComposerModule,

    NzButtonModule,
    NzTabsModule,
    NzSpinModule,
    NzSkeletonModule,
    NzLayoutModule,
    NzTableModule,
    NzToolTipModule,
    NzEmptyModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzBreadCrumbModule,
    NzMessageModule,
    NzModalModule,
  ]
})
export class NotificationDetailsModule {}
