import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { BackdropComponent } from '../shared/backdrop/backdrop.component';
import { NewtownsFractalWebGLBackground } from '../shared/backdrop/NewtownsFractalWebGLBackground';

@Component({
  selector: 'x-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  @ViewChild("container") container: HTMLDivElement;

  public bgAnimation: NewtownsFractalWebGLBackground = new NewtownsFractalWebGLBackground();
  public shouldHide: boolean = false;
  public isWebGlEnabled: boolean = BackdropComponent.isWebGlEnabled;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
    this.bgAnimation.iterations = 25; //this.bgAnimation.MAX_ITERATIONS;
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
