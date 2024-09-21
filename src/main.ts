import { enableProdMode } from '@angular/core';
import { env } from './environments/environment';
import { bootstrapApplication, Title } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { FaviconService } from './app/services/favicon.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

if ('prod' === env.enviornment) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [FaviconService, Title, provideHttpClient(withFetch()), provideRouter(routes)],
});
