import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorCharCountComponent } from './editor-char-count.component';


@NgModule({
  declarations: [EditorCharCountComponent],
  exports: [EditorCharCountComponent],
  imports: [
    CommonModule
  ]
})
export class EditorCharCountModule { }
