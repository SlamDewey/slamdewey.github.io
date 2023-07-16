import { Component } from '@angular/core';
import { Backdrop } from '../shared/backdrop/backdrop';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';

@Component({
  selector: 'x-backdroptest',
  templateUrl: './backdroptest.component.html',
  styleUrls: ['./backdroptest.component.scss']
})
export class BackdropTestComponent {

  public bgAnimation: Backdrop = new BallPitAnimatedBackground();

}
