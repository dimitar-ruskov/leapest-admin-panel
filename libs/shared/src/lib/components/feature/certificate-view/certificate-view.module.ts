import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateViewComponent } from './certificate-view.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [CertificateViewComponent],
  imports: [CommonModule, NzButtonModule, NzToolTipModule],
  exports: [CertificateViewComponent],
})
export class CertificateViewModule {}
