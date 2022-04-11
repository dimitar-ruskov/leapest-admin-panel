import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {FormLabelModule} from "../../common/form-label/form-label.module";
import {AddLinkModalComponent} from "./add-link-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [AddLinkModalComponent],
  exports: [AddLinkModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzInputModule
  ],
})
export class AddLinkModalModule {}
