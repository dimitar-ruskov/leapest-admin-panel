import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NotificationFilterPillsComponent } from './notification-filter-pills.component';
import { NotificationFilterPillComponent } from './notification-filter-pill/notification-filter-pill.component';

@NgModule({
  declarations: [NotificationFilterPillsComponent, NotificationFilterPillComponent],
  exports: [NotificationFilterPillsComponent],
  imports: [CommonModule, NzIconModule],
})
export class NotificationFilterPillsModule {}
