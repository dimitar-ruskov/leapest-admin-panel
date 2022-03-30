import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {MaterialsTrackingDetailsModalComponent} from "./materials-tracking-details-modal.component";

@NgModule({
  declarations: [MaterialsTrackingDetailsModalComponent],
  exports: [MaterialsTrackingDetailsModalComponent],
  imports: [CommonModule],
})
export class MaterialsTrackingDetailsModalModule {}
