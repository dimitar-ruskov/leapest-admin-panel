import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TAgendaComponent } from './t-agenda.component';
import {TAgendaSectionModalComponent} from "./modals/t-agenda-section-modal/t-agenda-section-modal.component";
import {
  EditAgendaDateTimeModalComponent
} from "./modals/edit-agenda-date-time-modal/edit-agenda-date-time-modal.component";
import { HasDayPassedPipe } from './pipes/has-day-passed.pipe';
import {EditAgendaDateTimeInfoPipe} from "./pipes/edit-agenda-date-time-info.pipe";
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {EditorCharCountModule} from "../../common/editor-char-count/editor-char-count.module";
import {NoMaterialsModule} from "../../common/no-materials/no-materials.module";

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { QuillModule } from 'ngx-quill';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";


@NgModule({
  declarations: [
    TAgendaComponent,
    TAgendaSectionModalComponent,
    EditAgendaDateTimeModalComponent,
    EditAgendaDateTimeInfoPipe,
    HasDayPassedPipe
  ],
  imports: [
    CommonModule,

    ReactiveFormsModule,
    QuillModule,
    EditorCharCountModule,
    NoMaterialsModule,
    FormLabelModule,

    NzButtonModule,
    NzCollapseModule,
    NzModalModule,
    NzFormModule,
    NzRadioModule,
    NzSelectModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule

  ],
  exports: [TAgendaComponent],
})
export class TAgendaModule {}
