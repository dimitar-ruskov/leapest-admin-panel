import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ResendEmailModalComponent} from "./resend-email-modal.component";

@NgModule({
  declarations: [ResendEmailModalComponent],
  exports: [ResendEmailModalComponent],
  imports: [CommonModule]
})
export class ResendEmailModalModule {}
