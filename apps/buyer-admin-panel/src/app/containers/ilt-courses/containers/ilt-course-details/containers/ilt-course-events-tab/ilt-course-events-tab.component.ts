import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'leap-ilt-course-events-tab',
  templateUrl: './ilt-course-events-tab.component.html',
  styleUrls: ['./ilt-course-events-tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IltCourseEventsTabComponent implements OnInit {
  @Input() parentId: string;
  @Input() sku: string;

  constructor() {}

  ngOnInit(): void {}
}
