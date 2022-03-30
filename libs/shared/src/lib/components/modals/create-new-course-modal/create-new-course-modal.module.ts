import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {CreateNewCourseModalComponent} from "./create-new-course-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  declarations: [CreateNewCourseModalComponent],
  exports: [CreateNewCourseModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputModule,
    NzSelectModule
  ],
})
export class CreateNewCourseModalModule {}
