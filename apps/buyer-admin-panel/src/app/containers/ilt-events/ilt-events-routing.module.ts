import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IltEventsComponent } from "./ilt-events.component";

const routes: Routes = [
  {
    path: '',
    component: IltEventsComponent,
    children: [
      {
        path: '',
        loadChildren: async () =>
          import('./containers/ilt-events-list/ilt-events-list.module')
            .then((m) => m.IltEventsListModule)
      },
      {
        path: 'create/:sku',
        loadChildren: async () =>
          import('./containers/ilt-events-create/ilt-events-create.module')
            .then((m) => m.IltEventsCreateModule)
      },
      {
        path: 'details/:sku',
        loadChildren: async () =>
          import('./containers/ilt-events-details/ilt-events-details.module')
            .then((m) => m.IltEventsDetailsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IltEventsRoutingModule {}
