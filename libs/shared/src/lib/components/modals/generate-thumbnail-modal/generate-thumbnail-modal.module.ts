import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {GenerateThumbnailModalComponent} from "./generate-thumbnail-modal.component";

@NgModule({
  declarations: [GenerateThumbnailModalComponent],
  exports: [GenerateThumbnailModalComponent],
  imports: [CommonModule],
})
export class GenerateThumbnailModalModule {}
