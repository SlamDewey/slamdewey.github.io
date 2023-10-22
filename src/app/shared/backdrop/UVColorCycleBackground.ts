import { WebGLBackdrop } from "./backdrop";

export class UVColorCycleBackground extends WebGLBackdrop {
  protected override init(): void {}

  private totalTime: number = 0;

  readonly VertexShader: string = `\
#version 300 es
precision mediump float;

in vec2 coordinates;

void main() {
  gl_Position = vec4(coordinates.xy, 0.0, 1.0);
}
  `;
  readonly FragmentShader: string = `\
#version 300 es
precision mediump float;

const float TIME_SCALAR = 0.7;

uniform vec2 screenSize;
uniform float totalTime;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / screenSize.xy;
  uv.x *= screenSize.x / screenSize.y;
  
  float xOffset = 5.1 + 0.5 * sin(totalTime * TIME_SCALAR);
  
  vec3 color = 0.5 + 0.5 * cos(xOffset + uv.yyx + vec3(0., 2., 4.));
  fragColor = vec4(color.xyz, 1.);
}
  `;
  protected override getVertexShader(): string {
    return this.VertexShader;
  }
  protected override getFragmentShader(): string {
    return this.FragmentShader;
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
    gl.uniform1f(
      gl.getUniformLocation(shaderProgram, "totalTime"),
      this.totalTime,
    );
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
  }
}
