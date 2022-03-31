import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NavbarComponent} from "./navbar.component";
import {UserComponent} from "./user/user.component";
import {UserMenuItemComponent} from "./user/user-menu-item/user-menu-item.component";

import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";

@NgModule({
  declarations: [NavbarComponent, UserComponent, UserMenuItemComponent],
  exports: [NavbarComponent, UserComponent, UserMenuItemComponent],
  imports: [
    CommonModule,

    NzMenuModule,
    NzLayoutModule,
    NzAvatarModule,
    NzDropDownModule,
  ]
})
export class NavbarModule { }
