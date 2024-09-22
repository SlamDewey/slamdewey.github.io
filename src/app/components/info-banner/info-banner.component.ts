import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'x-info-banner',
  templateUrl: './info-banner.component.html',
  styleUrls: ['./info-banner.component.scss'],
  standalone: true,
})
export class InfoBannerComponent implements OnInit {
  @Input('variant') variant: 'basic' | 'error' | 'warning' | 'success';

  constructor() {}

  ngOnInit(): void {}
}
