import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {NotificationPreviewModalComponent} from "./notification-preview-modal.component";

import {NzSkeletonModule} from "ng-zorro-antd/skeleton";

@NgModule({
  declarations: [NotificationPreviewModalComponent],
  exports: [NotificationPreviewModalComponent],
  imports: [
    CommonModule,
    NzSkeletonModule
  ],
})
export class NotificationPreviewModalModule {}
