import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { NewtownsFractalWebGLBackground } from '../shared/backdrop/NewtownsFractalWebGLBackground';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  public bgAnimation: Backdrop = new NewtownsFractalWebGLBackground();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
  }

  setShaderMode(i: number) {
  }

}
