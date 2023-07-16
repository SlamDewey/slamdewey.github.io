import { OnInit, Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackdropComponent } from 'src/app/shared/backdrop/backdrop.component';
import { NewtownsFractalWebGLBackground } from './NewtownsFractalWebGLBackground';

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

  ngOnInit(): void {
    this.isWebGlEnabled = BackdropComponent.isWebGlEnabled;
  }

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
    this.bgAnimation.iterations = 15;
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