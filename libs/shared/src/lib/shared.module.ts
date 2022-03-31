import {NgModule} from '@angular/core';

import {SharedModalsModule} from "./components/modals/shared-modals.module";
import {SharedCommonComponentsModule} from "./components/common/shared-common-components.module";
import {SharedCoreComponentsModule} from "./components/core/shared-core-components.module";
import {SharedFeatureComponentsModule} from "./components/feature/shared-feature-components.module";

@NgModule({
  imports: [
    SharedCommonComponentsModule,
    SharedCoreComponentsModule,
    SharedFeatureComponentsModule,
    SharedModalsModule,
  ],
  exports: [
    SharedCommonComponentsModule,
    SharedCoreComponentsModule,
    SharedFeatureComponentsModule,
    SharedModalsModule,
  ]
})
export class SharedModule {
}
