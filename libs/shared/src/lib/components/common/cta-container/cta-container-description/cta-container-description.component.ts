import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'h2[leap-cta-container-description]',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      font-size: 16px;
      color: #8e8fa6;
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaContainerDescriptionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
