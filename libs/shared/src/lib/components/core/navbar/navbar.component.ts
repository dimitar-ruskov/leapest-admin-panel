import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { EnvironmentService } from 'src/app/snatch/services';
import { IGlobalStateModel } from 'src/app/shared/global-state.model';
import { IDomainData } from '../../model/domain-data.model';
import { IProfile } from '../../../core/state/core.state';

import { OktaAuthStateService } from '@okta/okta-angular';
import { GetLearnerProfile } from 'src/app/core/state/core.actions';

@Component({
  selector: 'leap-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() isAdminPanel: boolean;

  @Select((state: IGlobalStateModel) => state.core.getProfilePending)
  getProfilePending$: Observable<boolean>;

  @Select((state: IGlobalStateModel) => state.core.profile)
  profile$: Observable<IProfile>;

  @Select((state: IGlobalStateModel) => state.core.domainData)
  domainData$: Observable<IDomainData>;

  constructor(
    private readonly store: Store,
    public environment: EnvironmentService,
    public authStateService: OktaAuthStateService,
  ) {}

  ngOnInit() {
    this.store.dispatch(new GetLearnerProfile());
  }

  ngOnDestroy(): void {}
}
