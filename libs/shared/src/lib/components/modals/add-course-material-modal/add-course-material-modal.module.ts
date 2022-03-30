import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {AddCourseMaterialModalComponent} from "./add-course-material-modal.component";

import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [AddCourseMaterialModalComponent],
  exports: [AddCourseMaterialModalComponent],
  imports: [
    CommonModule,
    FormsModule,

    InfiniteScrollModule,
    NzSpinModule,
    NzIconModule,
    NzInputModule
  ],
})
export class AddCourseMaterialModalModule {}
