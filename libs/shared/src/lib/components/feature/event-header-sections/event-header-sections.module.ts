import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventHeaderSectionsComponent } from './event-header-sections.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  declarations: [EventHeaderSectionsComponent],
  exports: [EventHeaderSectionsComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzToolTipModule
  ]
})
export class EventHeaderSectionsModule { }
