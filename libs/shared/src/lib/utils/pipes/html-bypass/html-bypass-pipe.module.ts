import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HtmlBypassPipe} from "./html-bypass.pipe";

@NgModule({
  declarations: [HtmlBypassPipe],
  imports: [CommonModule],
  exports: [HtmlBypassPipe],
})
export class HtmlBypassPipeModule {}
