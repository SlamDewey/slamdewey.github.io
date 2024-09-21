import { WebGLBackdrop } from "src/app/components/backdrop/backdrop";
import {
  DEFAULT_SHADER_PROGRAMS,
  SHADER_HEADER,
  ShaderProgramData,
  UNIFORM_DEFS,
} from "./shader-programs";

export class ReactiveWebGLBackground extends WebGLBackdrop {
  private totalTime: number = 0;

  public shaderProgramData: ShaderProgramData = DEFAULT_SHADER_PROGRAMS[0];
  public fragmentShaderOverride: string | undefined = undefined;

  constructor(defaultShader?: ShaderProgramData) {
    super();
    if (defaultShader) this.shaderProgramData = defaultShader;
  }

  public attemptRecompileAndReinitialize(): void {
    const [vert, frag] = this.compileWebGLShaders(
      this.gl,
      this.getVertexShader(),
      this.getFragmentShader(),
    );

    if (vert && frag) {
      this.totalTime = 0;
      super.reInitialize();
    }
  }

  public override getVertexShader(): string {
    return this.shaderProgramData.vertexShader;
  }
  public override getFragmentShader(): string {
    return (
      this.fragmentShaderOverride ??
      SHADER_HEADER + UNIFORM_DEFS + this.shaderProgramData.fragmentShader
    );
  }

  protected initializeDrawVariables(
    gl: WebGLRenderingContext,
    shaderProgram: WebGLProgram,
  ) {
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(
      coord,
      2,
      gl.FLOAT,
      false,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.enableVertexAttribArray(coord);

    gl.uniform2f(
      gl.getUniformLocation(shaderProgram, "screenSize"),
      this.width,
      this.height,
    );
    gl.uniform2f(
      gl.getUniformLocation(shaderProgram, "mousePosition"),
      this.mousePosition.x,
      this.mousePosition.y,
    );
    gl.uniform1f(
      gl.getUniformLocation(shaderProgram, "totalTime"),
      this.totalTime,
    );
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "deltaTime"), 0);
  }

  protected update(deltaTime: number): void {}

  protected override prepareDrawVariables(
    gl: WebGLRenderingContext,
    deltaTime: number,
  ): void {
    this.totalTime += deltaTime;
    gl.uniform1f(
      gl.getUniformLocation(this.shaderProgram, "totalTime"),
      this.totalTime,
    );
    gl.uniform1f(
      gl.getUniformLocation(this.shaderProgram, "deltaTime"),
      deltaTime,
    );
    gl.uniform2f(
      gl.getUniformLocation(this.shaderProgram, "mousePosition"),
      this.mousePosition.x,
      this.mousePosition.y,
    );
  }
}
