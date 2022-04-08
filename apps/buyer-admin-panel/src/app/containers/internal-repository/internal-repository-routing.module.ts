import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternalRepositoryDetailsComponent } from './containers/internal-repository-details/internal-repository-details.component';
import { InternalRepositoryListComponent } from './containers/internal-repository-list/internal-repository-list.component';
import { InternalRepositoryComponent } from './internal-repository.component';

const routes: Routes = [
  {
    path: '',
    component: InternalRepositoryComponent,
    children: [
      {
        path: '',
        component: InternalRepositoryListComponent
      },

      {
        path: 'details/:sku',
        component: InternalRepositoryDetailsComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalRepositoryRoutingModule { }
