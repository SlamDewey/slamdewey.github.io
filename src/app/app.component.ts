import { Component, ViewEncapsulation } from '@angular/core';
import { FaviconService } from './services/favicon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(readonly faviconService: FaviconService) {}
}
