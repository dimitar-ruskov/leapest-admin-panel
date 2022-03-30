import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CertificateSelectComponent } from './certificate-select.component';
import {CertificateViewModule} from "../certificate-view/certificate-view.module";

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';


@NgModule({
  declarations: [CertificateSelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CertificateViewModule, NzSwitchModule, NzSelectModule],
  exports: [CertificateSelectComponent],
})
export class CertificateSelectModule {}
