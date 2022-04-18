import { Injectable } from "@angular/core";
import { State } from "@ngxs/store";
import {
  MarketplaceRepositoryListState
} from "../containers/marketplace-repository-list/state/marketplace-repository-list.state";


@State({
  name: 'marketplaceRepository',
  children: [MarketplaceRepositoryListState]
})
@Injectable()
export class MarketplaceRepositoryState {}
