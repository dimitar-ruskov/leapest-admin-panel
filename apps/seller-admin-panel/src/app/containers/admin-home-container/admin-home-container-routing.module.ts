import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminHomeContainerComponent} from "./admin-home-container.component";

const routes: Routes = [
  {
    path: '',
    component: AdminHomeContainerComponent,
    children: [
      // {
      //   path: 'ilt-courses',
      //   loadChildren: async () =>
      //     import('./containers/ilt-courses-container/ilt-courses-container.module').then(
      //       (m) => m.IltCoursesContainerModule,
      //     ),
      // },
      // {
      //   path: 'ilt-events',
      //   loadChildren: async () => import('./containers/ilt-events/ilt-events.module').then((m) => m.IltEventsModule),
      // },
      // {
      //   path: 'internal-repository',
      //   loadChildren: async () =>
      //     import('./containers/internal-repository/internal-repository.module').then((m) => m.InternalRepositoryModule),
      // },
      // {
      //   path: 'marketplace-repo',
      //   loadChildren: async () =>
      //     import('./containers/marketplace-repository/marketplace-repository.module').then(
      //       (m) => m.MarketplaceRepositoryModule,
      //     ),
      // },
      // {
      //   path: 'self-paced-courses',
      //   loadChildren: async () =>
      //     import('./containers/self-paced-courses-container/self-paced-courses-container.module').then(
      //       (m) => m.SelfPacedCoursesContainerModule,
      //     ),
      // },
      // {
      //   path: 'certificates',
      //   loadChildren: async () =>
      //     import('./containers/certificates/certificates.module').then((m) => m.CertificatesModule),
      // },
      // {
      //   path: 'instructors',
      //   loadChildren: async () =>
      //     import('./containers/instructors/instructors.module').then((m) => m.InstructorsModule),
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: async () =>
      //     import('./containers/notifications-container/notifications-container.module').then(
      //       (m) => m.NotificationsContainerModule,
      //     ),
      //   canActivate: [AdminUserGuard],
      // },
      {
        path: ':type/404',
        loadChildren: async () =>
          import('../../../../../../libs/shared/src/lib/components/core/not-found/not-found.module')
            .then((m) => m.NotFoundModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminHomeContainerRoutingModule {
}
