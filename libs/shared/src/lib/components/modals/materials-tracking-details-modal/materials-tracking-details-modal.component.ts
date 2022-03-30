import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'leap-materials-tracking-details-modal',
  templateUrl: './materials-tracking-details-modal.component.html',
  styleUrls: ['./materials-tracking-details-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialsTrackingDetailsModalComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
  }

  formatTotalTime(timeSpent: number): string {
    return moment.utc(timeSpent * 1000).format('HH:mm:ss');
  }
}
