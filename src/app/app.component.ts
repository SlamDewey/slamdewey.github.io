import { Component } from '@angular/core';
import { FaviconService } from './services/favicon.service';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SiteHeaderComponent, RouterOutlet],
})
export class AppComponent {
  constructor(readonly faviconService: FaviconService) {}
}
