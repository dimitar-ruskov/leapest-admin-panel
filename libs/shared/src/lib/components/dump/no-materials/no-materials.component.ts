import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-no-materials',
  template: '<ng-content></ng-content>',
  styleUrls: ['./no-materials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoMaterialsComponent {}
