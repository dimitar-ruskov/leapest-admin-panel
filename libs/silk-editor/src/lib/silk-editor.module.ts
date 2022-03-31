import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilkEditor } from './silk-editor.component';

@NgModule({
  declarations: [SilkEditor],
  imports: [CommonModule],
  exports: [SilkEditor],
})
export class SilkEditorModule {}
