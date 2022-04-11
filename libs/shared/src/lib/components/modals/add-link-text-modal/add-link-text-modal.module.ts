import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {FormLabelModule} from "../../common/form-label/form-label.module";
import {AddLinkTextModalComponent} from "./add-link-text-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [AddLinkTextModalComponent],
  exports: [AddLinkTextModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzInputModule
  ],
})
export class AddLinkTextModalModule {}
