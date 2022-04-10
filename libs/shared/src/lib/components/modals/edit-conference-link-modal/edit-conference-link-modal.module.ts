import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditConferenceLinkModalComponent} from "./edit-conference-link-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {FormLabelModule} from "../../common/form-label/form-label.module";

@NgModule({
  declarations: [EditConferenceLinkModalComponent],
  exports: [EditConferenceLinkModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule
  ],
})
export class EditConferenceLinkModalModule {}
