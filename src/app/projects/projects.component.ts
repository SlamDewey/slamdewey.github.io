import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  NewtownsFractalWebGLBackground,
  PositionalChoice,
} from "./pages/newtonsfractal/NewtownsFractalWebGLBackground";
import { ReactiveWebGLBackground } from "./pages/fragmentwriter/ReactiveWebGLBackground";
import { MOUSE_POSITION_NEWTONS_FRACTAL_SHADER } from "./pages/fragmentwriter/shader-programs";
import { PerlinNoiseBackdrop } from "../shared/backdrop/PerlinNoiseBackdrop";

@Component({
  selector: "x-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit {
  @ViewChild("test", { static: false }) testCanvas: ElementRef;

  public bgAnimation = new PerlinNoiseBackdrop();
  public newtonsFractalAnimation: NewtownsFractalWebGLBackground;
  public fragmentWriterTileBackdrop: ReactiveWebGLBackground;

  constructor() {}

  ngOnInit(): void {
    this.newtonsFractalAnimation = new NewtownsFractalWebGLBackground();
    this.newtonsFractalAnimation.iterations = 5;
    this.newtonsFractalAnimation.positionalChoice =
      PositionalChoice.CIRCULAR_MOTION;

    this.fragmentWriterTileBackdrop = new ReactiveWebGLBackground();
    this.fragmentWriterTileBackdrop.shaderProgramData =
      MOUSE_POSITION_NEWTONS_FRACTAL_SHADER;
  }
}
