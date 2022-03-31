import { NgModule } from '@angular/core';
import {CreationStepperModule} from "./creation-stepper/creation-stepper.module";
import {CtaContainerModule} from "./cta-container/cta-container.module";
import {DeferredContainerModule} from "./deffered-container/deferred-container.module";
import {EditorCharCountModule} from "./editor-char-count/editor-char-count.module";
import {FormGuidanceModule} from "./form-guidance/form-guidance.module";
import {FormLabelModule} from "./form-label/form-label.module";
import {GeneralInfoModule} from "./general-info/general-info.module";
import {NoMaterialsModule} from "./no-materials/no-materials.module";
import {TFormControlModule} from "./t-form-control/t-form-control.module";
import {TGridModule} from "./t-grid/t-grid.module";
import {TMenuModule} from "./t-menu/t-menu.module";
import {TableControlPanelModule} from "./table-control-panel/table-control-panel.module";
import {TableGridModule} from "./table-grid/table-grid.module";
import {TableSearchModule} from "./table-search/table-search.module";

const components = [
  CreationStepperModule,
  CtaContainerModule,
  DeferredContainerModule,
  EditorCharCountModule,
  FormGuidanceModule,
  FormLabelModule,
  GeneralInfoModule,
  NoMaterialsModule,
  TFormControlModule,
  TGridModule,
  TMenuModule,
  TableControlPanelModule,
  TableGridModule,
  TableSearchModule
];

@NgModule({
  imports: components,
  exports: components
})
export class SharedCommonComponentsModule {}
