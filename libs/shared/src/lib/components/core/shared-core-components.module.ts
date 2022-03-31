import {NgModule} from '@angular/core';
import {FooterModule} from "./footer/footer.module";
import {NavbarModule} from "./navbar/navbar.module";
import {NotAuthenticatedModule} from "./not-authenticated/not-authenticated.module";
import {NotAuthorizedModule} from "./not-authorized/not-authorized.module";
import {NotFoundModule} from "./not-found/not-found.module";

const components = [
  FooterModule,
  NavbarModule,
  NotAuthenticatedModule,
  NotAuthorizedModule,
  NotFoundModule
];

@NgModule({
  imports: components,
  exports: components
})
export class SharedCoreComponentsModule {
}
