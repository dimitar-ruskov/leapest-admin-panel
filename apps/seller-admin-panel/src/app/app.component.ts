import {Component, OnInit} from '@angular/core';
import {Observable, take} from "rxjs";
import {Select} from "@ngxs/store";

import {IDomainData} from "@leapest-admin-panel/shared";

@Component({
  selector: 'leap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {

  constructor() {
  }

  @Select((state: IGlobalStateModel) => state.core.domainData)
  domainData$: Observable<IDomainData>;

  @Select((state: IGlobalStateModel) => state.core.showNotSyncedUserModal)
  showNotSyncedUserModal$: Observable<boolean>;

  favIcon: HTMLLinkElement = document.querySelector('#appFavicon');

  ngOnInit() {
    this.domainData$.pipe(take(1)).subscribe((domainData) => {
      if (domainData.name === 'futureskillsprime') {
        this.favIcon.href = './assets/svg/primeicon.ico';
      } else {
        this.favIcon.href = './assets/svg/favicon.ico';
      }
    });
  }

  reload() {
    location.reload();
  }
}
