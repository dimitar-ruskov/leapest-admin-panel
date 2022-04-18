import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {LxpPrivacy, PublishedCourseToLXP} from "../../../../models";

@Component({
  selector: 'leap-single-lxp-settings',
  templateUrl: './single-lxp-settings.component.html',
  styleUrls: ['./single-lxp-settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleLxpSettingsComponent {
  @Input() publishedDomain: PublishedCourseToLXP;

  constructor() {}

  getPublishPrivacy(lxpPrivate: boolean): string {
    return lxpPrivate ? LxpPrivacy.PRIVATE : LxpPrivacy.PUBLIC;
  }
}
