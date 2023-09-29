import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';

const INITIAL_HIDE_HEADER_WAIT_TIME = 5_000;
const HIDE_HEADER_WAIT_TIME = 2_000;

@Component({
  selector: 'x-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit {
  public activeRoute: string;
  public headerHideControl$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private isInBounds: boolean;
  private hideTimer: Observable<0>;
  private hideTimerSubscription: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) this.onRouteChange();
    });
    window.addEventListener('mousemove', (e) => this.onMouseMove(e, this));

    this.hideTimer = timer(INITIAL_HIDE_HEADER_WAIT_TIME);
    this.hideTimerSubscription = this.hideTimer.subscribe(() =>
      this.headerHideControl$.next('hide'),
    );
  }

  private onMouseMove(e: MouseEvent, c: SiteHeaderComponent): void {
    if (e.clientX < document.body.clientWidth / 10) {
      c.headerHideControl$.next('');
      c.hideTimerSubscription?.unsubscribe();
      this.isInBounds = true;
    } else if (this.isInBounds) {
      this.isInBounds = false;
      c.hideTimer = timer(HIDE_HEADER_WAIT_TIME);
      c.hideTimerSubscription = c.hideTimer.subscribe(() =>
        c.headerHideControl$.next('hide'),
      );
    }
  }

  private onRouteChange() {
    const splitRoute: string[] = this.router.url.slice(1).split(/[//?,&+#]/);
    this.activeRoute = splitRoute.length < 1 ? '' : splitRoute[0];
  }
}
