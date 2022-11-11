import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { NewtownsFractalWebGLBackground } from '../shared/backdrop/NewtownsFractalWebGLBackground';

@Component({
  selector: 'app-projects',
  templateUrl: './backdroptest.component.html',
  styleUrls: ['./backdroptest.component.scss']
})
export class BackdropTestComponent {

  public bgAnimation: Backdrop = new NewtownsFractalWebGLBackground();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
  }

}
