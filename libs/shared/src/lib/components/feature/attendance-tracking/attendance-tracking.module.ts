import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { AttendanceTrackingHelpComponent } from './attendance-tracking-help/attendance-tracking-help.component';
import { TableColumnPaginatorModule } from '../../../utils/directives/table-column-paginator/table-column-paginator.module';
import { AttendanceTrackingTableComponent } from './attendance-tracking-table/attendance-tracking-table.component';
import { AttendanceTrackingUserEntryComponent } from './attendance-tracking-user-entry/attendance-tracking-user-entry.component';
import { AttendanceTrackingStatusComponent } from './attendance-tracking-status/attendance-tracking-status.component';
import { AttendanceTrackingStatusIconComponent } from './attendance-tracking-status-icon/attendance-tracking-status-icon.component';
import { AttendanceTrackingEventCompletedComponent } from './attendance-tracking-event-completed/attendance-tracking-event-completed.component';
import { AttendanceTrackingReasonModalComponent } from './attendance-tracking-reason-modal/attendance-tracking-reason-modal.component';
import { AttendanceTrackingUnmarkCompletionModalComponent } from './attendance-tracking-unmark-completion-modal/attendance-tracking-unmark-completion-modal.component';

import {
  TableSearchModule
} from "../../common/table-search/table-search.module";
import {
  FormLabelModule
} from "../../common/form-label/form-label.module";
import {
  TableControlPanelModule
} from "../../common/table-control-panel/table-control-panel.module";

@NgModule({
  declarations: [
    AttendanceTrackingHelpComponent,
    AttendanceTrackingTableComponent,
    AttendanceTrackingUserEntryComponent,
    AttendanceTrackingStatusComponent,
    AttendanceTrackingStatusIconComponent,
    AttendanceTrackingEventCompletedComponent,
    AttendanceTrackingReasonModalComponent,
    AttendanceTrackingUnmarkCompletionModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TableColumnPaginatorModule,
    TableControlPanelModule,
    TableSearchModule,
    FormLabelModule,

    NzTableModule,
    NzButtonModule,
    NzSelectModule,
    NzToolTipModule,
    NzEmptyModule,
    NzInputModule,
    NzIconModule,
    NzFormModule,
    NzRadioModule,
    NzCheckboxModule,
  ],
  exports: [
    AttendanceTrackingHelpComponent,
    AttendanceTrackingTableComponent,
    AttendanceTrackingUserEntryComponent,
    AttendanceTrackingStatusComponent,
    AttendanceTrackingStatusIconComponent,
    AttendanceTrackingEventCompletedComponent,
    AttendanceTrackingReasonModalComponent,
    AttendanceTrackingUnmarkCompletionModalComponent,
  ]
})
export class AttendanceTrackingModule {}
