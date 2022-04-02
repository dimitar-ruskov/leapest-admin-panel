import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular';
import {GroupGuard, HybridUserGuard, ProvisionUserGuard} from "../../../../libs/shared/src/lib/utils/guards";


const routes: Routes = [
  {
    path: 'admin',
    loadChildren: async () =>
      import('./containers/admin-home-container/admin-home-container.module')
      .then((m) => m.AdminHomeContainerModule),
    canActivate: [OktaAuthGuard, HybridUserGuard, GroupGuard],
    data: {roles: ['buyer-admin', 'solar-partner', 'training-manager']}
  },
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
    canDeactivate: [ProvisionUserGuard],
  },
  {
    path: 'zoom-auth-landing',
  loadChildren: async () =>
  import('../../../../libs/shared/src/lib/components/core/zoom-auth-landing/zoom-auth-landing.module')
    .then((m) => m.ZoomAuthLandingModule)
  },
  {
    path: '401',
    loadChildren: async () =>
      import('../../../../libs/shared/src/lib/components/core/not-authenticated/not-authenticated.module')
        .then((m) => m.NotAuthenticatedModule)
  },
  {
    path: '403',
    loadChildren: async () =>
      import('../../../../libs/shared/src/lib/components/core/not-authorized/not-authorized.module')
        .then((m) => m.NotAuthorizedModule)
  },
  {
    path: '**',
    loadChildren: async () =>
      import('../../../../libs/shared/src/lib/components/core/not-found/not-found.module')
        .then((m) => m.NotFoundModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
  // providers: [{ provide: APP_BASE_HREF, useValue: '/hw' }],
})
export class AppRoutingModule {
}
