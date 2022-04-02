import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { OktaAuthStateService } from '@okta/okta-angular';

import {EnvironmentService} from "../../../../../../libs/shared/src/lib/utils/services/common";
import {TMenuInputModel} from "../../../../../../libs/shared/src/lib/models/interfaces";
import {
  GetCertificatesDictionary,
  GetConferencingToolsDictionary,
  GetCourseLevelDictionary,
  GetCustomAttendanceDictionary,
  GetILTLanguageDictionary,
  GetIRLanguageDictionary,
  GetMaterialTypes
} from "../../../../../../libs/shared/src/lib/state";

@Component({
  selector: 'leap-admin-home-container',
  templateUrl: './admin-home-container.component.html',
  styleUrls: ['./admin-home-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeContainerComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly environment: EnvironmentService,
    private readonly oktaAuthStateService: OktaAuthStateService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  menuConfig: TMenuInputModel;

  async ngOnInit() {
    this.fetchDictionariesAndRedirect();
    this.setMenuItems();
  }

  async fetchDictionariesAndRedirect() {
    const adminPermissions = await this.checkGroups(['buyer-admin', 'solar-partner']);
    if (adminPermissions) {
      this.store.dispatch([
        new GetILTLanguageDictionary(),
        new GetIRLanguageDictionary(),
        new GetCourseLevelDictionary(),
        new GetMaterialTypes(),
        new GetCertificatesDictionary(),
        new GetConferencingToolsDictionary(),
        new GetCustomAttendanceDictionary(),
      ]);
      // if (this.route.children?.length === 0) {
      //   this.router.navigate(['ilt-courses'], { relativeTo: this.route });
      // }
    } else {
      // if (this.route.children?.length === 0) {
      //   this.router.navigate(['ilt-events'], { relativeTo: this.route });
      // }
    }
  }

  async setMenuItems() {
    const adminPermissions = await this.checkGroups(['buyer-admin', 'solar-partner']);
    const hasAdminGroup = await this.checkGroups(['buyer-admin']);

    if (adminPermissions) {
      this.menuConfig = {
        items: [
          {
            key: 'courses',
            value: 'Courses',
            iconClass: 'fal fa-chalkboard-teacher',
            subItems: [
              { key: 'ilt-courses', value: 'Instructor-led Course Catalog' },
              { key: 'ilt-events', value: 'Instructor-led Course Events' },
              { key: 'self-paced-courses', value: 'Self-paced Courses' },
            ],
          },
          {
            key: 'courses',
            value: 'Resources',
            iconClass: 'fal fa-box-full',
            subItems: [{ key: 'internal-repository', value: 'Internal Repository' }],
          },
        ],
      };
      if (hasAdminGroup) {
        this.menuConfig.items.push({
          key: 'settings',
          value: 'Settings',
          iconClass: 'fal fa-cog',
          subItems: [{ key: 'notifications', value: 'Notifications' }],
        });
      }
      if (this.environment.envName === 'test' || this.environment.envName === 'preview') {
        this.menuConfig.items[1].subItems.push({ key: 'marketplace-repo', value: 'Marketplace Repository' });
      }
      this.menuConfig.items[1].subItems.push({ key: 'certificates', value: 'Certificate Templates' });
      this.menuConfig.items[1].subItems.push({ key: 'instructors', value: 'Instructors' });
    } else {
      this.menuConfig = {
        items: [
          {
            key: 'courses',
            value: 'Courses',
            iconClass: 'fal fa-chalkboard-teacher',
            subItems: [{ key: 'ilt-events', value: 'Instructor-led Course Events' }],
          },
        ],
      };
    }

    this.cdr.markForCheck();
  }

  async checkGroups(allowedGroups: string[]) {
    const oktaUser = await this.oktaAuthStateService['oktaAuth'].getUser();
    const oktaGroups = oktaUser['mkpGroups'];
    return allowedGroups.some((r) => oktaGroups.includes(r));
  }
}
