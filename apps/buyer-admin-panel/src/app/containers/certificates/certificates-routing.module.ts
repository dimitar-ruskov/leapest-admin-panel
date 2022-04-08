import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificatesComponent } from './certificates.component';
import { CertificatesListComponent } from './containers/certificates-list/certificates-list.component';
import { CertificateDetailsComponent } from './containers/certificate-details/certificate-details.component';

const routes: Routes = [
  {
    path: '',
    component: CertificatesComponent,
    children: [
      {
        path: '',
        component: CertificatesListComponent,
      },
      {
        path: 'details/:id',
        component: CertificateDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificatesRoutingModule {}
