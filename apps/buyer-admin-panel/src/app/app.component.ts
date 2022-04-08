import {Component, OnInit} from '@angular/core';
import {Observable, take} from "rxjs";
import {Select} from "@ngxs/store";

import {EnvironmentService} from "../../../../libs/shared/src/lib/utils/services/common";
import {IDomainData} from "../../../../libs/shared/src/lib/models/interfaces";
import {IGlobalStateModel} from "./state/global-state.model";

@Component({
  selector: 'buyer-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private readonly environmentService: EnvironmentService) {
  }

  @Select((state: IGlobalStateModel) => state.core.domainData)
  domainData$: Observable<IDomainData>;

  favIcon: HTMLLinkElement = document.querySelector('#appFavicon');

  ngOnInit() {
    this.domainData$.pipe(take(1)).subscribe((domainData) => {
      if (domainData.name === 'futureskillsprime') {
        this.favIcon.href = `${this.environmentService.assetsPath}/logo/primeicon.ico`;
      } else {
        this.favIcon.href = `${this.environmentService.assetsPath}/logo/favicon.ico`;
      }
    });
  }
}
