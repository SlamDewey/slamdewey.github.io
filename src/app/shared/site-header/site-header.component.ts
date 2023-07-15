import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, UrlTree } from '@angular/router';

@Component({
  selector: 'x-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit {

  public activeRoute: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.onRouteChange()
    });
  }

  private onRouteChange() {
    const splitRoute: string[] = this.router.url.slice(1).split(/[//?,&+#]/);
    this.activeRoute = splitRoute.length < 1 ? '' : splitRoute[0];
  }
}
