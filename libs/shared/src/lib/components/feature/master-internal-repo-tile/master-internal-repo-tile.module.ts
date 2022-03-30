import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterInternalRepoTileComponent } from './master-internal-repo-tile.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [
    MasterInternalRepoTileComponent
  ],
  exports: [
    MasterInternalRepoTileComponent
  ],
  imports: [
    CommonModule,
    NzButtonModule
  ]
})
export class MasterInternalRepoTileModule { }
