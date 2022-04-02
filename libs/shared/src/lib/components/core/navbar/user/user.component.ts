import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {EnvironmentService} from "../../../../utils/services/common";
import {IProfile} from "../../../../models/interfaces";

@Component({
  selector: 'leap-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class UserComponent implements OnInit {
  @Input() isAdminPanel: boolean;
  @Input() getProfilePending: boolean;
  @Input() profile: IProfile;

  defaultProfilePhotoUrl = this.environment.defaultProfilePhotoUrl;

  constructor(private readonly environment: EnvironmentService, private readonly router: Router) {}

  ngOnInit(): void {}

  redirectToOrderHistory() {
    this.router.navigate(['app', 'orders']);
  }

  redirectToLogout() {
    this.router.navigate(['logout']);
  }
}
