import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { ShaderTestAnimatedBackground } from '../shared/backdrop/ShaderTestAnimatedBackground';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public bgAnimation: Backdrop = new ShaderTestAnimatedBackground();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
  }

  ngOnInit(): void {
  }

}
