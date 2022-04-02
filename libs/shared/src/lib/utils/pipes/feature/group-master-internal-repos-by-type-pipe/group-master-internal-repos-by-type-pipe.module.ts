import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMasterInternalReposByTypePipe } from './group-master-internal-repos-by-type.pipe';



@NgModule({
  declarations: [GroupMasterInternalReposByTypePipe],
  imports: [
    CommonModule
  ],
  exports: [GroupMasterInternalReposByTypePipe]
})
export class GroupMasterInternalReposByTypePipeModule { }
