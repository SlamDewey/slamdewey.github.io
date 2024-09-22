import { enableProdMode } from '@angular/core';
import { env } from './environments/environment';
import { bootstrapApplication, Title } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { FaviconService } from './app/services/favicon.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { monacoConfig } from './app/util/monaco-config';

if ('prod' === env.enviornment) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    FaviconService,
    Title,
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig },
  ],
});
