import { Component, Input } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import {IDomainData, IProfile} from "../../../models/interfaces";
import {EnvironmentService} from "../../../utils/services/common";

@Component({
  selector: 'leap-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less'],
})
export class NavbarComponent {
  @Input() isAdminPanel: boolean;
  @Input() getProfilePending: boolean;
  @Input() profile: IProfile;
  @Input() domainData: IDomainData

  constructor(
    public environment: EnvironmentService,
    public authStateService: OktaAuthStateService,
  ) {}
}
