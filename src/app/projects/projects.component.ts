import { Component, inject, OnInit } from '@angular/core';
import { ReactiveWebGLBackground } from './pages/fragmentwriter/ReactiveWebGLBackground';
import { MOUSE_POSITION_NEWTONS_FRACTAL_SHADER } from './pages/fragmentwriter/shader-programs';
import { PerlinNoiseBackdrop } from '../components/backdrop/PerlinNoiseBackdrop';
import { BackdropComponent } from '../components/backdrop/backdrop.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../components/backdrop';

export type ProjectTileData = {
  routerLink: string;
  labelText: string;
  backdrop: Backdrop;
};

@Component({
  selector: 'x-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [BackdropComponent, RouterOutlet, RouterLink],
})
export class ProjectsComponent implements OnInit {
  private readonly titleService = inject(Title);

  public bgAnimation = new PerlinNoiseBackdrop();
  public fragmentWriterTileBackdrop: ReactiveWebGLBackground;
  public projects: ProjectTileData[];

  constructor() {
    this.fragmentWriterTileBackdrop = new ReactiveWebGLBackground();
    this.fragmentWriterTileBackdrop.shaderProgramData = MOUSE_POSITION_NEWTONS_FRACTAL_SHADER;

    this.projects = [
      {
        routerLink: 'fragmentwriter',
        labelText: 'Web Based GLSL Shader Editor',
        backdrop: this.fragmentWriterTileBackdrop,
      },
    ];
  }

  ngOnInit(): void {
    this.titleService.setTitle('Projects');
  }
}
