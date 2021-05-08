import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppConfig } from './app/app.config';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

fetch(environment.configUrl, { method: 'get' }).then((response) => {
  response.json().then((data: AppConfig) => {
    if (environment.production) {
      enableProdMode();
    }
    platformBrowserDynamic([{ provide: AppConfig, useValue: data }])
      .bootstrapModule(AppModule)
      .catch((err) => console.log(err));
  });
});