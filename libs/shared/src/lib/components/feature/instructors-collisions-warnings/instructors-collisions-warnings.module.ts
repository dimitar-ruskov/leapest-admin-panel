import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InstructorsCollisionsWarningsComponent} from "./instructors-collisions-warnings.component";
import {NzAlertModule} from "ng-zorro-antd/alert";

@NgModule({
  declarations: [InstructorsCollisionsWarningsComponent],
  exports: [InstructorsCollisionsWarningsComponent],
  imports: [CommonModule, NzAlertModule]
})
export class CourseMaterialsInputModule { }
