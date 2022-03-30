import { NgModule } from '@angular/core';
import {SharedModalsModule} from "./components/modals/shared-modals.module";

@NgModule({
  imports: [SharedModalsModule],
  exports: [SharedModalsModule]
})
export class SharedModule {}
