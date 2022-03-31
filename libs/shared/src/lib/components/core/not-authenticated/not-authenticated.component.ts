import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'leap-not-authenticated',
  templateUrl: './not-authenticated.component.html',
  styleUrls: ['./not-authenticated.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotAuthenticatedComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    // let oktaSession = await this.oktaAuthStateService['oktaAuth'].session.get()
    // if (oktaSession?.status == 'INACTIVE') {
    //   this.sessionInactive = true;
    //   this.cdr.markForCheck();
    // } else {
    //   const tokenResponse = await this.oktaAuthStateService['oktaAuth'].token.getWithRedirect()
    //   this.oktaAuthStateService['oktaAuth'].handleLoginRedirect(tokenResponse.tokens);
    // }
  }
}
