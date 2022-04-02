import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '../../../libs/shared/src/lib/assets/environments/environment';

if (environment.production) {
  enableProdMode();
}

const baseUrl = new URL(window.location.href);
const [domain] = baseUrl.host.split('.');
fetch(`${environment.amberBaseUrl}/api/bouncer/v2/domain/details/${domain}`)
  .then(async (response) => response.json())
  .then((response) => {
    const ssoConfig = response.data.ssoConfig;
    window.localStorage.setItem('okta-sso-config', JSON.stringify(ssoConfig));
  })
  .then(async () => {
    return platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
