import { APP_INITIALIZER, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { OKTA_CONFIG, OktaAuthGuard, OktaAuthModule } from "@okta/okta-angular";
import { OktaAuth } from "@okta/okta-auth-js";
import { NgxsModule, Store } from "@ngxs/store";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { QuillModule } from "ngx-quill";
import { NZ_CONFIG, NzConfig } from "ng-zorro-antd/core/config";
import { en_US, NZ_I18N } from "ng-zorro-antd/i18n";
import { NzModalModule } from "ng-zorro-antd/modal";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { GraphQLModule } from "./graphql.module";
import { CoreState } from "./state/core.state";
import { SetDomainData } from "./state/core.actions";
import { AuthInterceptor, ErrorInterceptor } from "../../../../libs/shared/src/lib/utils/interceptors";
import { GroupGuard, HybridUserGuard, ProvisionUserGuard } from "../../../../libs/shared/src/lib/utils/guards";
import { BootstrapService } from "../../../../libs/shared/src/lib/services/common/bootstrap.service";
import { environment } from "../../../../libs/shared/src/lib/environments/environment";
import { NzMessageModule } from "ng-zorro-antd/message";

const ngZorroConfig: NzConfig = {
  notification: {
    nzDuration: 30 * 1000,
    nzPauseOnHover: true,
    nzAnimate: true,
  },
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // @TODO Are we using animations?
    NzModalModule, // @TODO Fix for Modals in services Provided in root
    NzMessageModule, // @TODO Fix for services Provided in root
    HttpClientModule,
    GraphQLModule,
    OktaAuthModule,
    AppRoutingModule,
    NgxsModule.forRoot([CoreState], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    NgxsFormPluginModule.forRoot(),
    QuillModule.forRoot()
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    {
      provide: OKTA_CONFIG,
      useFactory: () => {
        const ssoConfig = JSON.parse(window.localStorage.getItem('okta-sso-config') as string);
        const oktaAuth = new OktaAuth({
          issuer: ssoConfig.issuer,
          clientId: ssoConfig.clientId,
          redirectUri: `${window.location.origin}/hw/login/callback`,
          scopes: ['openid', 'profile', 'offline_access'],
        });

        return { oktaAuth };
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (bootstrapService: BootstrapService, store: Store) => {
        const baseUrl = new URL(window.location.href);
        const [domain] = baseUrl.host.split('.');
        return async () =>
          bootstrapService
            .getDomainData(domain)
            .toPromise()
            .then((data) => {
              return store.dispatch(new SetDomainData(data.data));
            });
      },
      deps: [BootstrapService, Store],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    OktaAuthGuard,
    HybridUserGuard,
    GroupGuard,
    ProvisionUserGuard
  ],
})
export class AppModule {}
