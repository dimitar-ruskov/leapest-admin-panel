import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {NotificationLogoModalComponent} from "./notification-logo-modal.component";

import {NzButtonModule} from "ng-zorro-antd/button";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  declarations: [NotificationLogoModalComponent],
  exports: [NotificationLogoModalComponent],
  imports: [
    CommonModule,

    NzButtonModule,
    NzUploadModule,
    NzSpinModule
  ],
})
export class NotificationLogoModalModule {}
