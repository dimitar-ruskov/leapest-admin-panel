import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {DeleteCourseConfirmModalComponent} from "./delete-course-confirm-modal.component";
import {NzTableModule} from "ng-zorro-antd/table";

@NgModule({
  declarations: [DeleteCourseConfirmModalComponent],
  exports: [DeleteCourseConfirmModalComponent],
  imports: [
    CommonModule,
    NzTableModule,
  ],
})
export class DeleteCourseConfirmModalModule {}
