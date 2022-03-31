import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NotAuthenticatedComponent} from "./not-authenticated.component";

@NgModule({
  declarations: [NotAuthenticatedComponent],
  exports: [NotAuthenticatedComponent],
  imports: [CommonModule]
})
export class NotAuthenticatedModule { }
