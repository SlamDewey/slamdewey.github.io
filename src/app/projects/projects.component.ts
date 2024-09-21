import { Component, OnInit } from "@angular/core";
import { ReactiveWebGLBackground } from "./pages/fragmentwriter/ReactiveWebGLBackground";
import { MOUSE_POSITION_NEWTONS_FRACTAL_SHADER } from "./pages/fragmentwriter/shader-programs";
import { PerlinNoiseBackdrop } from "../components/backdrop/PerlinNoiseBackdrop";

@Component({
  selector: "x-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit {
  public bgAnimation = new PerlinNoiseBackdrop();
  public fragmentWriterTileBackdrop: ReactiveWebGLBackground;

  ngOnInit(): void {
    this.fragmentWriterTileBackdrop = new ReactiveWebGLBackground();
    this.fragmentWriterTileBackdrop.shaderProgramData =
      MOUSE_POSITION_NEWTONS_FRACTAL_SHADER;
  }
}
