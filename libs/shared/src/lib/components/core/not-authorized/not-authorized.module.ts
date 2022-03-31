import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NotAuthorizedComponent} from "./not-authorized.component";

@NgModule({
  declarations: [NotAuthorizedComponent],
  exports: [NotAuthorizedComponent],
  imports: [CommonModule]
})
export class NotAuthorizedModule { }
