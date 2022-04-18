import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {IKeyValuePair, LxpPrivacy, PublishedCourseToLXP} from "../../../../models";

@Component({
  selector: 'leap-multiple-lxp-settings',
  templateUrl: './multiple-lxp-settings.component.html',
  styleUrls: ['./multiple-lxp-settings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleLxpSettingsComponent implements OnInit {
  @Input() publishedDomains: PublishedCourseToLXP[];

  filteredDomains: PublishedCourseToLXP[];

  constructor() {}

  ngOnInit(): void {
    this.filteredDomains = this.publishedDomains;
  }

  getPublishPrivacy(lxpPrivate: boolean): string {
    return lxpPrivate ? LxpPrivacy.PRIVATE : LxpPrivacy.PUBLIC;
  }

  getStringifyValue(groups: IKeyValuePair[]): string {
    return groups?.map((group) => group.value).join(', ');
  }

  onSearch(search: string): void {
    this.filteredDomains = this.publishedDomains.filter(
      (publishedDomain) => publishedDomain.domain.search(search) !== -1,
    );
  }
}
