import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';

import {TableSearchModule} from "../../common/table-search/table-search.module";
import { DeleteProtocolModule } from '../../../utils/pipes/delete-protocol-pipe/delete-protocol.module';
import { MultipleLxpSettingsComponent } from './multiple-lxp-settings/multiple-lxp-settings.component';
import { CourseLxpSettingsComponent } from './course-lxp-settings.component';
import { SingleLxpSettingsComponent } from './single-lxp-settings/single-lxp-settings.component';

@NgModule({
  declarations: [CourseLxpSettingsComponent, SingleLxpSettingsComponent, MultipleLxpSettingsComponent],
  exports: [CourseLxpSettingsComponent, SingleLxpSettingsComponent, MultipleLxpSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,

    TableSearchModule,
    NzButtonModule,
    NzSelectModule,
    NzTagModule,
    DeleteProtocolModule,
  ],
})
export class CourseLxpSettingsModule {}
