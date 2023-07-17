import { OnInit, Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackdropComponent } from 'src/app/shared/backdrop/backdrop.component';
import { NewtownsFractalWebGLBackground, PositionalChoice, ZoomChoice } from './NewtownsFractalWebGLBackground';

@Component({
  selector: 'x-newtonsfractal',
  templateUrl: './newtonsfractal.component.html',
  styleUrls: ['./newtonsfractal.component.scss']
})
export class NewtonsfractalComponent implements OnInit {

  @ViewChild("container") container: HTMLDivElement;

  public bgAnimation: NewtownsFractalWebGLBackground = new NewtownsFractalWebGLBackground();
  public shouldHide: boolean = false;
  public isWebGlEnabled: boolean = BackdropComponent.isWebGlEnabled;

  constructor(
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Hobbies & Projects');

    this.isWebGlEnabled = BackdropComponent.isWebGlEnabled;
    this.bgAnimation.iterations = 15;
    this.bgAnimation.zoomChoice = ZoomChoice.ANIMATED_ZOOM_TO_ORIGIN;
    this.bgAnimation.positionalChoice = PositionalChoice.CIRCULAR_MOTION;
  }

  public incrementIterationCount(): void {
    if (this.bgAnimation.iterations < this.bgAnimation.MAX_ITERATIONS)
      this.bgAnimation.iterations++;
  }

  public decrementIterationCount(): void {
    if (this.bgAnimation.iterations > this.bgAnimation.MIN_ITERATIONS)
      this.bgAnimation.iterations--;
  }

}