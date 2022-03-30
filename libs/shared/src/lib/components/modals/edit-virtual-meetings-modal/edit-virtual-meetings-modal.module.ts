import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {EditVirtualMeetingsModalComponent} from "./edit-virtual-meetings-modal.component";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  declarations: [EditVirtualMeetingsModalComponent],
  exports: [EditVirtualMeetingsModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    NzSelectModule,
    NzRadioModule,
    NzButtonModule,
    NzSpinModule
  ],
})
export class EditVirtualMeetingsModalModule {}
