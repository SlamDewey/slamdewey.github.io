import { Component, Input } from '@angular/core';
import { Backdrop } from '../backdrop/backdrop';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'x-backdrop-tile',
  templateUrl: './backdrop-tile.component.html',
  styleUrls: ['./backdrop-tile.component.scss'],
  standalone: true,
  imports: [BackdropComponent, RouterLink],
})
export class BackdropTileComponent {
  @Input('backdrop') bgAnimation: Backdrop;
  @Input() routerLink: string;
  @Input() linkText: string;
}
