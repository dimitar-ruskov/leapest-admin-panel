import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ZoomAuthLandingComponent} from "./zoom-auth-landing.component";
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  declarations: [ZoomAuthLandingComponent],
  imports: [CommonModule, NzSpinModule],
  exports: [ZoomAuthLandingComponent],
})
export class ZoomAuthLandingModule {}
