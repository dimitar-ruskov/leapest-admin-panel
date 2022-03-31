import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found.component';
import { CommonModule } from '@angular/common';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFoundRoutingModule, NzButtonModule, NzBreadCrumbModule],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
