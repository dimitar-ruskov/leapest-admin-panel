import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {UploadThumbnailModalComponent} from "./upload-thumbnail-modal.component";

import {NzButtonModule} from "ng-zorro-antd/button";
import {NzUploadModule} from "ng-zorro-antd/upload";

@NgModule({
  declarations: [UploadThumbnailModalComponent],
  exports: [UploadThumbnailModalComponent],
  imports: [
    CommonModule,

    NzButtonModule,
    NzUploadModule
  ],
})
export class UploadThumbnailModalModule {}
