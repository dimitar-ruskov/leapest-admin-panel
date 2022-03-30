import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoMaterialsComponent } from './no-materials.component';



@NgModule({
  declarations: [NoMaterialsComponent],
  imports: [
    CommonModule
  ],
  exports: [NoMaterialsComponent]
})
export class NoMaterialsModule { }
