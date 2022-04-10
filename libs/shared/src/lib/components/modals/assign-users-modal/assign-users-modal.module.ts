import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {AssignUsersModalComponent} from "./assign-users-modal.component";
import {FormLabelModule} from "../../common/form-label/form-label.module";

import {NzFormModule} from "ng-zorro-antd/form";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [AssignUsersModalComponent],
  exports: [AssignUsersModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabelModule,
    NzFormModule,
    NzSpinModule,
    NzRadioModule,
    NzUploadModule,
    NzButtonModule,
    NzAlertModule,
    NzTableModule,
    NzSelectModule,
    NzTagModule,
    NzIconModule,
    NzInputModule
  ],
})
export class AssignUsersModalModule {}
