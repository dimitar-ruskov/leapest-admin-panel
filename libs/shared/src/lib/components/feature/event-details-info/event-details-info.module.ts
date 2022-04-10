import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EventDetailsInfoComponent } from './event-details-info.component';
import { SchedulingDetailsComponent } from './scheduling-details/scheduling-details.component';
import {
  GeneralInfoModule
} from "../../common/general-info/general-info.module";

@NgModule({
  declarations: [EventDetailsInfoComponent, SchedulingDetailsComponent],
  imports: [CommonModule, GeneralInfoModule],
  exports: [EventDetailsInfoComponent, SchedulingDetailsComponent],
})
export class EventDetailsInfoModule {}
