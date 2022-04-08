import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcatMaterialsPipe } from './concat-materials-pipe';

@NgModule({
  declarations: [ConcatMaterialsPipe],
  imports: [CommonModule],
  exports: [ConcatMaterialsPipe],
})
export class ConcatMaterialsPipeModule {}
