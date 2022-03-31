import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import {TMenuComponent} from "./t-menu.component";

import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzDividerModule} from "ng-zorro-antd/divider";

@NgModule({
  declarations: [TMenuComponent],
  exports: [TMenuComponent],
  imports: [
    CommonModule,
    RouterModule,

    NzMenuModule,
    NzDividerModule
  ]
})
export class TMenuModule { }
