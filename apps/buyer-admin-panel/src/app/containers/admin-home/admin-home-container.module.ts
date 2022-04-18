import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminHomeContainerRoutingModule } from "./admin-home-container-routing.module";
import { AdminHomeContainerComponent } from "./admin-home-container.component";
import { AdminUserGuard } from "../../../../../../libs/shared/src/lib/utils/guards";
import { NavbarModule } from "../../../../../../libs/shared/src/lib/components/core/navbar/navbar.module";
import { TMenuModule } from "../../../../../../libs/shared/src/lib/components/common/t-menu/t-menu.module";
import { FooterModule } from "../../../../../../libs/shared/src/lib/components/core/footer/footer.module";

import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzSliderModule } from "ng-zorro-antd/slider";

@NgModule({
  declarations: [AdminHomeContainerComponent],
  exports: [AdminHomeContainerComponent],
  imports: [
    CommonModule,
    AdminHomeContainerRoutingModule,

    FooterModule,
    NavbarModule,
    TMenuModule,
    NzLayoutModule,
    NzSliderModule
  ],
  providers: [AdminUserGuard]
})
export class AdminHomeContainerModule {}
