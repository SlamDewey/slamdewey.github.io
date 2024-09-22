import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { routes } from '../app.routes';
import { Subscription } from 'rxjs';

const faviconLinkId = 'faviconLink';

@Injectable({
  providedIn: 'root',
})
export class FaviconService implements OnDestroy {
  private faviconLinkElement: HTMLLinkElement;
  private routerSubscription: Subscription;

  constructor(readonly router: Router) {
    this.routerSubscription = router.events.subscribe({
      next: (e) => this.onRoute(e),
    });
    this.faviconLinkElement = document.getElementById(faviconLinkId) as HTMLLinkElement;
  }

  public ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private onRoute(e: any): void {
    if (e instanceof NavigationEnd) {
      const route = routes.find((route) => '/' + route.path === e.url);
      if (route?.faviconPath) {
        this.setFavicon('assets/' + route.faviconPath);
      }
    }
  }

  public setFavicon(path: string): void {
    if (this.faviconLinkElement) {
      this.faviconLinkElement.href = path;
    }
  }
}
