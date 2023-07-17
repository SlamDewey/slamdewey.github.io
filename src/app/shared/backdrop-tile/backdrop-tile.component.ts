import { Component, Input } from '@angular/core';
import { Backdrop } from '../backdrop/backdrop';

@Component({
  selector: 'x-backdrop-tile',
  templateUrl: './backdrop-tile.component.html',
  styleUrls: ['./backdrop-tile.component.scss']
})
export class BackdropTileComponent {

  @Input('backdrop') bgAnimation: Backdrop;
  @Input() routerLink: string;
  @Input() linkText: string;
}
