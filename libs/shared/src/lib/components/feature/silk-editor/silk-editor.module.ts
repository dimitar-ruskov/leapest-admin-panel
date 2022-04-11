import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilkEditor } from './containers/silk-editor/silk-editor.component';
import { SubjectEditor } from './containers/subject-editor/subject-editor.component';

@NgModule({
  declarations: [SilkEditor, SubjectEditor],
  imports: [CommonModule],
  exports: [SilkEditor, SubjectEditor],
})
export class SilkEditorModule {}
