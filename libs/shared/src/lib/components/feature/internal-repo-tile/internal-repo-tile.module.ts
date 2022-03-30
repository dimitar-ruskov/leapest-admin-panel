import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalRepoTileComponent } from './internal-repo-tile.component';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [InternalRepoTileComponent],
  exports: [InternalRepoTileComponent],
  imports: [
    CommonModule,
    NzButtonModule
  ]
})
export class InternalRepoTileModule { }
