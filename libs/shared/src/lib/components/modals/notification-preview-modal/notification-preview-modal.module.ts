import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {NotificationPreviewModalComponent} from "./notification-preview-modal.component";
import {HtmlBypassPipeModule} from "../../../utils/pipes/html-bypass/html-bypass-pipe.module";

import {NzSkeletonModule} from "ng-zorro-antd/skeleton";

@NgModule({
  declarations: [NotificationPreviewModalComponent],
  exports: [NotificationPreviewModalComponent],
  imports: [
    CommonModule,
    HtmlBypassPipeModule,
    NzSkeletonModule
  ],
})
export class NotificationPreviewModalModule {}
