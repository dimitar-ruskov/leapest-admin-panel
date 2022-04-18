import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {TypeTileComponent} from "./type-tile.component";
import {ColorSvgPipe} from "./pipes/color-svg.pipe";
import { HtmlBypassPipeModule } from "../../../utils/pipes/html-bypass/html-bypass-pipe.module";

@NgModule({
  declarations: [TypeTileComponent, ColorSvgPipe],
  exports: [TypeTileComponent],
  imports: [CommonModule, HtmlBypassPipeModule],
})
export class TypeTileModule {}
