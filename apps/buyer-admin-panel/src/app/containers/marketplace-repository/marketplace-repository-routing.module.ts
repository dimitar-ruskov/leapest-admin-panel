import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketplaceRepositoryComponent } from './marketplace-repository.component';
import { MarketplaceRepositoryListComponent } from './containers/marketplace-repository-list/marketplace-repository-list.component';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceRepositoryComponent,
    children: [
      {
        path: '',
        component: MarketplaceRepositoryListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceRepositoryRoutingModule {}
