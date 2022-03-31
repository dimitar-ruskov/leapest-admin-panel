import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DeferredContainerComponent} from "./deferred-container.component";

@NgModule({
  declarations: [DeferredContainerComponent],
  exports: [DeferredContainerComponent],
  imports: [CommonModule]
})
export class DeferredContainerModule { }
