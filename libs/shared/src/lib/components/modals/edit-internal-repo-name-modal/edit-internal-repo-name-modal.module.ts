import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditInternalRepoNameModalComponent} from "./edit-internal-repo-name-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [EditInternalRepoNameModalComponent],
  exports: [EditInternalRepoNameModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputModule
  ],
})
export class EditInternalRepoNameModalModule {}
