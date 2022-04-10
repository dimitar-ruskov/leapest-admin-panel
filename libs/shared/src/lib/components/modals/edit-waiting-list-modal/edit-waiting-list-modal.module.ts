import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditWaitingListModalComponent} from "./edit-waiting-list-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSwitchModule} from "ng-zorro-antd/switch";

@NgModule({
  declarations: [EditWaitingListModalComponent],
  exports: [EditWaitingListModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzInputNumberModule,
    NzSwitchModule
  ],
})
export class EditWaitingListModalModule {}
