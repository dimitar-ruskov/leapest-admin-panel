import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { NotificationDetailsComponent } from './notification-details.component';

import { SharedModule } from '../../../../../shared/shared.module';
import { TemplateComposerModule } from '../../../../../common/common-ilt-notifications/template-composer/template-composer.module';
import { CertificateViewModule } from '../../../../components/certificate-view/certificate-view.module';
import { CertificatePreviewModule } from '../../../../components/certificate-preview/certificate-preview.module';
import { SnatchModule } from '../../../../../snatch/snatch.module';
import { GeneralInfoModule } from '../../../../components/general-info/general-info.module';
import { TableGridModule } from '../../../../components/table-grid/table-grid.module';
import { TableControlPanelModule } from '../../../../components/table-control-panel/table-control-panel.module';
import { TableSearchModule } from '../../../../components/table-search/table-search.module';
import { CtaContainerModule } from '../../../../components/cta-container/cta-container.module';
import { FormLabelModule } from '../../../../components/form-label/form-label.module';
import { TAgendaModule } from '../../../../components/t-agenda/t-agenda.module';

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

@NgModule({
  declarations: [NotificationDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    SnatchModule,
    SharedModule,
    GeneralInfoModule,
    FormLabelModule,
    TableControlPanelModule,
    TableSearchModule,
    CtaContainerModule,
    TableGridModule,
    TAgendaModule,
    CertificateViewModule,
    CertificatePreviewModule,
    TemplateComposerModule,

    NgxsFormPluginModule,
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
  ],
  providers: [],
})
export class NotificationDetailsModule {}
