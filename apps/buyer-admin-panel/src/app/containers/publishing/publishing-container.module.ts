import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxsModule} from "@ngxs/store";

import { PublishingRoutingModule } from './publishing-routing.module';
import { PublishingContainerComponent } from './publishing-container.component';
import {PublishingState} from "./state/publishing.state";

@NgModule({
  declarations: [PublishingContainerComponent],
  imports: [
    CommonModule,
    PublishingRoutingModule,
    NgxsModule.forFeature([PublishingState]),
  ],
})
export class PublishingContainerModule {}
