import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MasterInternalRepoTileModule } from '../master-internal-repo-tile/master-internal-repo-tile.module';
import { CourseMaterialsInputComponent } from './course-materials-input.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormLabelModule } from '../../dump/form-label/form-label.module';
import { NoMaterialsModule } from '../../dump/no-materials/no-materials.module';


@NgModule({
  declarations: [CourseMaterialsInputComponent],
  exports: [
    CourseMaterialsInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    MasterInternalRepoTileModule,
    FormLabelModule,
    NoMaterialsModule,

    InfiniteScrollModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSpinModule,
  ]
})
export class CourseMaterialsInputModule { }
