import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditCourseCompletionModalComponent} from "./edit-course-completion-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzRadioModule} from "ng-zorro-antd/radio";

@NgModule({
  declarations: [EditCourseCompletionModalComponent],
  exports: [EditCourseCompletionModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzRadioModule
  ],
})
export class EditCourseCompletionModalModule {}
