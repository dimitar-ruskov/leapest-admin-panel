import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralInfoComponent } from './general-info.component';
import { GeneralInfoThumbnailBoxComponent } from './general-info-thumbnail-box/general-info-thumbnail-box.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { GeneralInfoFieldComponent } from './general-info-field/general-info-field.component';
import { GeneralInfoFieldValueComponent } from './general-info-field-value/general-info-field-value.component';
import { CertificateViewModule } from '../../feature/certificate-view/certificate-view.module';

@NgModule({
  declarations: [
    GeneralInfoComponent,
    GeneralInfoThumbnailBoxComponent,
    GeneralInfoFieldComponent,
    GeneralInfoFieldValueComponent,
  ],
  exports: [
    GeneralInfoComponent,
    GeneralInfoThumbnailBoxComponent,
    GeneralInfoFieldComponent,
    GeneralInfoFieldValueComponent,
  ],
  imports: [CommonModule, NzButtonModule, CertificateViewModule],
})
export class GeneralInfoModule {}
