import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { OktaAuthStateService } from '@okta/okta-angular';
import {IDomainData, IProfile} from "../../../models/interfaces";
import {EnvironmentService} from "../../../utils/services/common";
import {GetLearnerProfile} from "../../../state";

@Component({
  selector: 'leap-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less'],
})
export class NavbarComponent implements OnInit {
  @Input() isAdminPanel: boolean;

  @Select(state => state.core.getProfilePending)
  getProfilePending$: Observable<boolean>;

  @Select(state => state.core.profile)
  profile$: Observable<IProfile>;

  @Select(state => state.core.domainData)
  domainData$: Observable<IDomainData>;

  constructor(
    private readonly store: Store,
    public environment: EnvironmentService,
    public authStateService: OktaAuthStateService,
  ) {}

  ngOnInit() {
    this.store.dispatch(new GetLearnerProfile());
  }
}
