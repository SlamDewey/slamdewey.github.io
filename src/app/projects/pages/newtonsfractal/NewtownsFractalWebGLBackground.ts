import { WebGLBackdrop } from "src/app/components/backdrop/backdrop";

export enum ZoomChoice {
  STATIC_ZOOM,
  ANIMATED_ZOOM_TO_ORIGIN,
  ANIMATED_ZOOM_CUSTOM,
}

export enum PositionalChoice {
  STATIC_POSITION,
  X_AXIS_MOTION,
  CIRCULAR_MOTION,
}

export class NewtownsFractalWebGLBackground extends WebGLBackdrop {
  public zoomChoice: ZoomChoice = ZoomChoice.STATIC_ZOOM;
  public positionalChoice: PositionalChoice = PositionalChoice.STATIC_POSITION;
  public positionalScalar: number = 0.4;
  private time: number = 0;

  readonly VertexShader: string = `
  precision mediump float;

  attribute vec2 coordinates;
  
  void main() {
    gl_Position = vec4(coordinates.xy, 0.0, 1.0);
  }
  `;

  public readonly MAX_ITERATIONS: number = 50;
  public readonly MIN_ITERATIONS: number = 1;

  readonly FragmentShader: string = `
  precision mediump float;
  
  const int MAX_ITERATIONS = ${this.MAX_ITERATIONS};
  const float brightness = 0.8;
  
  uniform vec2 screenSize;
  
  uniform int zoomChoice;
  uniform int positionalChoice;
  uniform float positionalScalar;
  
  uniform float time;
  uniform int iter;

  vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  vec2 complex_div(vec2 a, vec2 b) {
    float den = pow(b.x, 2.0) + pow(b.y, 2.0);
    return vec2((a.x * b.x + a.y * b.y) / den, (a.y * b.x - a.x * b.y) / den);
  }
  float complex_sqdist(vec2 a, vec2 b) {
    return pow(a.x - b.x, 2.0) + pow(a.y - b.y, 2.0);
  }
  vec2 complex_pow(vec2 x, vec2 e) {
    float r = sqrt(pow(x.x, 2.0) + pow(x.y, 2.0));
    float theta = atan(x.y, x.x);
    float xc = pow(r, e.x) * exp(-e.y * theta);
    float yc = e.x * theta + e.y * log(r);
    return vec2(xc * cos(yc), xc * sin(yc));
  }
  vec2 f(vec2 x) {
    return complex_pow(x, vec2(3.0, 0.0)) - vec2(1.0, 0.0);
  }
  vec2 fp(vec2 x) {
    return complex_mul(vec2(3.0, 0.0), complex_pow(x, vec2(2.0, 0.0)));
  }
  
  vec2 newtonsMethod(vec2 x0, vec2 iterationOffset) {
    vec2 xn = x0;
    for (int n = 0; n < MAX_ITERATIONS; n++) {
      xn = xn - complex_div(f(xn), fp(xn)) + iterationOffset;
      if (iter < n) {
        break; 
      }
    }
    return xn;
  }
  void fColor(vec2 iterated_location) {
    vec2 uv = gl_FragCoord.xy / screenSize.xy;
    
    float dist1 = complex_sqdist(iterated_location, vec2(-0.5, 0.866));
    float dist2 = complex_sqdist(iterated_location, vec2(-0.5, -0.866));
    float dist3 = complex_sqdist(iterated_location, vec2(1.0, 0.0));
    
    if (dist1 < dist2 && dist1 < dist3) {
      gl_FragColor = vec4(uv.x * brightness, 0.0, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
    }
    else if (dist2 < dist1 && dist2 < dist3) {
      gl_FragColor = vec4(0.0, uv.y * brightness, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
    }
    else if (dist3 < dist1 && dist3 < dist2) {
      gl_FragColor = vec4(1.0 - uv.xy * brightness, ((cos(time) + 1.0) / 2.0) * brightness, 1.0);
    }
    else {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  }
  
  void main() {
    vec2 relCoordinate = (gl_FragCoord.xy - (screenSize.xy / 2.0)) / (screenSize.x);
    float scalar;
    vec2 locationInput;
    
    if (zoomChoice == ${ZoomChoice.STATIC_ZOOM}) {
      scalar = 3.0 * positionalScalar;
    }
    if (zoomChoice == ${ZoomChoice.ANIMATED_ZOOM_TO_ORIGIN}) {
      scalar = 1.5 * ((-cos(time / 5.0) + 1.0) / 2.0);
    }
    if (zoomChoice == ${ZoomChoice.ANIMATED_ZOOM_CUSTOM}) {
      scalar = 10.0 * ((sin(time / 5.0) + 1.0) / 2.0) + 3.0;
    }
    
    if (positionalChoice == ${PositionalChoice.STATIC_POSITION}) {
      locationInput = vec2(0.0, 0.0);
    }
    else if (positionalChoice == ${PositionalChoice.X_AXIS_MOTION}) {
      locationInput = vec2(sin(time) * positionalScalar, 0.0);
    }
    else if (positionalChoice == ${PositionalChoice.CIRCULAR_MOTION}) {
      locationInput = -vec2(positionalScalar * sin(time / 3.0), positionalScalar * cos(time / 2.0));
    }
    
    vec2 iterated_location = newtonsMethod(relCoordinate * scalar, locationInput);
    fColor(iterated_location);
  }
  `;

  public iterations: number = this.MIN_ITERATIONS;

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
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "time"), this.time);
    gl.uniform1i(
      gl.getUniformLocation(shaderProgram, "zoomChoice"),
      this.zoomChoice,
    );
    gl.uniform1i(
      gl.getUniformLocation(shaderProgram, "positionalChoice"),
      this.positionalChoice,
    );
    gl.uniform1f(
      gl.getUniformLocation(shaderProgram, "positionalScalar"),
      this.positionalScalar,
    );
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "iter"), this.iterations);
  }

  protected update(deltaTime: number): void {}

  protected override prepareDrawVariables(
    gl: WebGLRenderingContext,
    deltaTime: number,
  ): void {
    this.time += deltaTime;
    gl.uniform1f(gl.getUniformLocation(this.shaderProgram, "time"), this.time);
    gl.uniform1i(
      gl.getUniformLocation(this.shaderProgram, "iter"),
      this.iterations,
    );
    gl.uniform1i(
      gl.getUniformLocation(this.shaderProgram, "zoomChoice"),
      this.zoomChoice,
    );
    gl.uniform1i(
      gl.getUniformLocation(this.shaderProgram, "positionalChoice"),
      this.positionalChoice,
    );
    gl.uniform1f(
      gl.getUniformLocation(this.shaderProgram, "positionalScalar"),
      this.positionalScalar,
    );
  }
}
