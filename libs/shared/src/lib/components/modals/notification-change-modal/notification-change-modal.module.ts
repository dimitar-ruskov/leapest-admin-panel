import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {NotificationChangeModalComponent} from "./notification-change-modal.component";

@NgModule({
  declarations: [NotificationChangeModalComponent],
  exports: [NotificationChangeModalComponent],
  imports: [CommonModule],
})
export class NotificationChangeModalModule {}
