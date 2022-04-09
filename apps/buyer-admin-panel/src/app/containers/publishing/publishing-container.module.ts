import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishingRoutingModule } from './publishing-routing.module';
import { PublishingContainerComponent } from './publishing-container.component';

@NgModule({
  declarations: [PublishingContainerComponent],
  imports: [CommonModule, PublishingRoutingModule],
})
export class PublishingContainerModule {}
