import { WebGLBackdrop } from "./backdrop";

export class ShaderTestAnimatedBackground extends WebGLBackdrop {

  protected init(): void {
  }

  readonly VertexShader: string = `
  precision mediump float;

  attribute vec2 coordinates;
  
  void main() {
    gl_Position = vec4(coordinates, 0.0, 1.0);
  }
  `;
  readonly FragmentShader: string = `
  precision mediump float;
  
  uniform vec2 screenSize;
  uniform float time;

  void main() {
    float brightness = 1.0;
    vec2 uv = gl_FragCoord.xy / screenSize.xy / ((cos(time) + 1.0) / 2.0);
    gl_FragColor = vec4(uv.xy * brightness, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
  }
  `;
  protected override getVertexShader(): string {
    return this.VertexShader;
  }
  protected override getFragmentShader(): string {
    return this.FragmentShader;
  }

  protected initializeDrawVariables(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(coord);

    gl.uniform2f(gl.getUniformLocation(shaderProgram, "screenSize"), this.width, this.height);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "time"), this.time);
  }

  protected update(deltaTime: number): void {
  }

  private time: number = 0;
  protected override prepareDrawVariables(gl: WebGLRenderingContext, deltaTime: number): void {
    this.time += deltaTime;
    gl.uniform1f(gl.getUniformLocation(this.shaderProgram, "time"), this.time);
  }
}