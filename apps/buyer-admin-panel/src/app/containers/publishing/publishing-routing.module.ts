import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PublishingContainerComponent } from "./publishing-container.component";

const routes: Routes = [
  {
    path: '',
    component: PublishingContainerComponent,
    children: [
      {
        path: '',
        loadChildren: async () =>
          import('./containers/publishing-list/publishing-list.module').then(
            (m) => m.PublishingListModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishingRoutingModule {}
