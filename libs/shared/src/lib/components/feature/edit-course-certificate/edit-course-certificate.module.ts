import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditCourseCertificateComponent } from './edit-course-certificate.component';
import { CertificateSelectModule } from '../certificate-select/certificate-select.module';

import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [EditCourseCertificateComponent],
  imports: [CommonModule, ReactiveFormsModule, CertificateSelectModule, NzFormModule],
  exports: [EditCourseCertificateComponent],
})
export class EditCourseCertificateModule {}
