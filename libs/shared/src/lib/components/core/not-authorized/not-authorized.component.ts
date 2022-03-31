import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotAuthorizedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
