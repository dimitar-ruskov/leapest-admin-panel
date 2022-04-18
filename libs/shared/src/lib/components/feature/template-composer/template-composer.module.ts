import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {SilkEditorModule} from "../silk-editor/silk-editor.module";
import { TemplateComposerComponent } from './template-composer.component';
import { PlaceholderPickerComponent } from './placeholder-picker/placeholder-picker.component';
import {FormGuidanceModule} from "../../common/form-guidance/form-guidance.module";
import {AddLinkTextModalModule} from "../../modals/add-link-text-modal/add-link-text-modal.module";
import {AddLinkModalModule} from "../../modals/add-link-modal/add-link-modal.module";

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {FormLabelModule} from "../../common/form-label/form-label.module";
import {FormSubmitModule} from "../../../utils/directives/form-submit/form-submit.module";

@NgModule({
  declarations: [TemplateComposerComponent, PlaceholderPickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SilkEditorModule,
    AddLinkTextModalModule,
    AddLinkModalModule,
    FormGuidanceModule,
    FormLabelModule,
    FormSubmitModule,

    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzToolTipModule
  ],
  exports: [TemplateComposerComponent],
})
export class TemplateComposerModule {}
