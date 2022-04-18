import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRecipientsModalComponent } from './notification-recipients-modal.component';
import {TableSearchModule} from "../../common/table-search/table-search.module";
import {TableGridModule} from "../../common/table-grid/table-grid.module";

import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [NotificationRecipientsModalComponent],
  exports: [NotificationRecipientsModalComponent],
  imports: [CommonModule, TableSearchModule, TableGridModule, NzTableModule],
})
export class NotificationRecipientsModalModule {}
