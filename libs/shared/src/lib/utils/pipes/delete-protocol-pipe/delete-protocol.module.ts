import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteProtocolPipe } from './delete-protocol.pipe';

@NgModule({
  declarations: [DeleteProtocolPipe],
  exports: [DeleteProtocolPipe],
  imports: [CommonModule],
})
export class DeleteProtocolModule {}
