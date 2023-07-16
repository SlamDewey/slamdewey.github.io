import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';
import { NewtownsFractalWebGLBackground } from './pages/newtonsfractal/NewtownsFractalWebGLBackground';

@Component({
  selector: 'x-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  @ViewChild('test', { static: false }) testCanvas: ElementRef;

  public bgAnimation = new BallPitAnimatedBackground();
  public newtonsFractalAnimation = new NewtownsFractalWebGLBackground();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
  }
}
