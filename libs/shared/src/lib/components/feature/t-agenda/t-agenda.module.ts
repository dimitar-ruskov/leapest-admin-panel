import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TAgendaComponent } from './t-agenda.component';
import { HasDayPassedPipe } from './pipes/has-day-passed.pipe';
import {EditAgendaDateTimeInfoPipe} from "./pipes/edit-agenda-date-time-info.pipe";

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { QuillModule } from 'ngx-quill';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { EditorCharCountModule } from '../../dump/editor-char-count/editor-char-count.module';
import { NoMaterialsModule } from '../../dump/no-materials/no-materials.module';
import { FormLabelModule } from '../../dump/form-label/form-label.module';

@NgModule({
  declarations: [TAgendaComponent, EditAgendaDateTimeInfoPipe, HasDayPassedPipe],
  imports: [
    CommonModule,
    NzButtonModule,
    NzCollapseModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzRadioModule,
    QuillModule,
    NzSelectModule,
    NzInputModule,
    EditorCharCountModule,
    NoMaterialsModule,
    FormLabelModule,
  ],
  exports: [TAgendaComponent],
})
export class TAgendaModule {}
