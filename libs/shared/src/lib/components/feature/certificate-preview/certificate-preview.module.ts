import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificatePreviewComponent } from './certificate-preview.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzSpinModule} from "ng-zorro-antd/spin";

@NgModule({
  declarations: [CertificatePreviewComponent],
  imports: [CommonModule, NzButtonModule, NzSpinModule],
  exports: [CertificatePreviewComponent],
  providers: [CertificatesService],
})
export class CertificatePreviewModule {}
