import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {PublishToLxpModalComponent} from "./publish-to-lxp-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzIconModule} from "ng-zorro-antd/icon";

@NgModule({
  declarations: [PublishToLxpModalComponent],
  exports: [PublishToLxpModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzTagModule,
    NzToolTipModule,
    NzIconModule
  ],
})
export class PublishToLxpModalModule {}
