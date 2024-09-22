import { Component, inject, OnInit } from '@angular/core';
import { ReactiveWebGLBackground } from './pages/fragmentwriter/ReactiveWebGLBackground';
import { MOUSE_POSITION_NEWTONS_FRACTAL_SHADER } from './pages/fragmentwriter/shader-programs';
import { PerlinNoiseBackdrop } from '../components/backdrop/PerlinNoiseBackdrop';
import { BackdropComponent } from '../components/backdrop/backdrop.component';
import { BackdropTileComponent } from '../components/backdrop-tile/backdrop-tile.component';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'x-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [BackdropComponent, BackdropTileComponent, RouterOutlet],
})
export class ProjectsComponent implements OnInit {
  public bgAnimation = new PerlinNoiseBackdrop();
  public fragmentWriterTileBackdrop: ReactiveWebGLBackground;

  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('Projects');
    this.fragmentWriterTileBackdrop = new ReactiveWebGLBackground();
    this.fragmentWriterTileBackdrop.shaderProgramData = MOUSE_POSITION_NEWTONS_FRACTAL_SHADER;
  }
}
