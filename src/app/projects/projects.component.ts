import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';
import { NewtownsFractalWebGLBackground, PositionalChoice } from './pages/newtonsfractal/NewtownsFractalWebGLBackground';

@Component({
  selector: 'x-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  @ViewChild('test', { static: false }) testCanvas: ElementRef;

  public bgAnimation = new BallPitAnimatedBackground();
  public newtonsFractalAnimation: NewtownsFractalWebGLBackground;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Projects');
  }

  ngOnInit(): void {
    this.newtonsFractalAnimation = new NewtownsFractalWebGLBackground();
    this.newtonsFractalAnimation.iterations = 5;
    this.newtonsFractalAnimation.positionalChoice = PositionalChoice.CIRCULAR_MOTION;
  }
}