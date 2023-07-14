import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NewtownsFractalWebGLBackground } from 'src/app/shared/backdrop/NewtownsFractalWebGLBackground';
import { BackdropComponent } from 'src/app/shared/backdrop/backdrop.component';

@Component({
  selector: 'app-newtonsfractal',
  templateUrl: './newtonsfractal.component.html',
  styleUrls: ['./newtonsfractal.component.scss']
})
export class NewtonsfractalComponent {

  @ViewChild("container") container: HTMLDivElement;

  public bgAnimation: NewtownsFractalWebGLBackground = new NewtownsFractalWebGLBackground();
  public shouldHide: boolean = false;
  public isWebGlEnabled: boolean = BackdropComponent.isWebGlEnabled;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
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