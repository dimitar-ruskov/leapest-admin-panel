import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {TMenuInputModel} from "../../../models/interfaces";


@Component({
  selector: 'leap-t-menu',
  templateUrl: './t-menu.component.html',
  styleUrls: ['./t-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TMenuComponent {
  @Input() config: TMenuInputModel;
}
