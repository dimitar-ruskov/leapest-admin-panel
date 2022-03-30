import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {TypeTileComponent} from "./type-tile.component";
import {ColorSvgPipe} from "./pipes/color-svg.pipe";

@NgModule({
  declarations: [TypeTileComponent, ColorSvgPipe],
  exports: [TypeTileComponent],
  imports: [CommonModule],
})
export class TypeTileModule {}
