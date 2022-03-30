import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RemoveWaitingListModalComponent} from "./remove-waiting-list-modal.component";

@NgModule({
  declarations: [RemoveWaitingListModalComponent],
  exports: [RemoveWaitingListModalComponent],
  imports: [CommonModule],
})
export class RemoveWaitingListModalModule {}
