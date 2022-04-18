import { Component, ChangeDetectionStrategy } from '@angular/core';
import {EnvironmentService} from "../../../services/common";


@Component({
  selector: 'leap-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor(public readonly environmentService: EnvironmentService) {
  }
}
