import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { NewtownsFractalWebGLBackground } from '../shared/backdrop/NewtownsFractalWebGLBackground';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  @ViewChild("container") container: HTMLDivElement;

  public bgAnimation: Backdrop = new NewtownsFractalWebGLBackground();
  public shouldHide: boolean = false;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
  }
}
