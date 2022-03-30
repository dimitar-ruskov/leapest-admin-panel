import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TGridComponent } from './t-grid.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzElementPatchModule } from 'ng-zorro-antd/core/element-patch';
import {NzIconModule} from "ng-zorro-antd/icon";

@NgModule({
  declarations: [
    TGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    NzTableModule,
    NzInputModule,
    NzSpinModule,
    NzToolTipModule,
    NzPaginationModule,
    NzEmptyModule,
    NzButtonModule,
    NzElementPatchModule,
    NzIconModule
  ],
  exports: [
    TGridComponent
  ]
})
export class TGridModule { }
