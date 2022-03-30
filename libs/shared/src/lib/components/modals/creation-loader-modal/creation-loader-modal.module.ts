import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {CreationLoaderModalComponent} from "./creation-loader-modal.component";

import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
  declarations: [CreationLoaderModalComponent],
  exports: [CreationLoaderModalComponent],
  imports: [
    CommonModule,

    NzSpinModule,
    NzButtonModule
  ],
})
export class CreationLoaderModalModule {}
