import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { MarketplaceRepositoryService } from './service/marketplace-repository.service';
import { MarketplaceRepositoryListState } from './state/marketplace-repository-list.state';
import { MarketplaceRepositoryRoutingModule } from './marketplace-repository-routing.module';
import { MarketplaceRepositoryComponent } from './marketplace-repository.component';
import { MarketplaceRepositoryListComponent } from './containers/marketplace-repository-list/marketplace-repository-list.component';

import {TableSearchModule} from "../../../shared/src/lib/components/common/table-search/table-search.module";
import {CtaContainerModule} from "../../../shared/src/lib/components/common/cta-container/cta-container.module";
import {TGridModule} from "../../../shared/src/lib/components/common/t-grid/t-grid.module";
import {TableGridModule} from "../../../shared/src/lib/components/common/table-grid/table-grid.module";
import {
  TableControlPanelModule
} from "../../../shared/src/lib/components/common/table-control-panel/table-control-panel.module";

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [MarketplaceRepositoryComponent, MarketplaceRepositoryListComponent],
  imports: [
    CommonModule,
    MarketplaceRepositoryRoutingModule,

    NgxsModule.forFeature([MarketplaceRepositoryListState]),
    CtaContainerModule,
    TGridModule,
    TableGridModule,
    TableControlPanelModule,
    TableSearchModule,

    NzTableModule,
    NzTabsModule,
    NzButtonModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzUploadModule,
    NzDropDownModule,
    NzToolTipModule,
  ],
  providers: [MarketplaceRepositoryService],
})
export class MarketplaceRepositoryModule {}
