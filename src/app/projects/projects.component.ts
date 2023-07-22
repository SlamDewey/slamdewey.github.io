import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';
import { NewtownsFractalWebGLBackground, PositionalChoice } from './pages/newtonsfractal/NewtownsFractalWebGLBackground';
import { ShaderTestAnimatedBackground } from '../shared/backdrop/ShaderTestAnimatedBackground';
import { ReactiveWebGLBackground } from './pages/fragmentwriter/ReactiveWebGLBackground';
import { WebGLBackdrop } from '../shared/backdrop/backdrop';

@Component({
  selector: 'x-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  @ViewChild('test', { static: false }) testCanvas: ElementRef;

  public bgAnimation = new BallPitAnimatedBackground();
  public newtonsFractalAnimation: NewtownsFractalWebGLBackground;
  public fragmentWriterTileBackdrop: WebGLBackdrop;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Projects');
  }

  ngOnInit(): void {
    this.newtonsFractalAnimation = new NewtownsFractalWebGLBackground();
    this.newtonsFractalAnimation.iterations = 5;
    this.newtonsFractalAnimation.positionalChoice = PositionalChoice.CIRCULAR_MOTION;

    this.fragmentWriterTileBackdrop = new ReactiveWebGLBackground();
  }
}