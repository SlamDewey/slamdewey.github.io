import { WebGLBackdrop } from "./backdrop";

export class WalkingNoiseBackdrop extends WebGLBackdrop {
  protected override init(): void {}

  private totalTimeLocation: WebGLUniformLocation;
  private totalTime = 0;

  readonly VertexShader = `\
#version 300 es
precision mediump float;

in vec2 coordinates;

void main() {
  gl_Position = vec4(coordinates.xy, 0.0, 1.0);
}
  `;
  readonly FragmentShader = `\
#version 300 es
precision mediump float;

uniform vec2 screenSize;
uniform float totalTime;

out vec4 fragColor;

const float ZOOM = 7.;
const float TIME_SCALAR = 0.1;
const float RADIUS = 15.;

const int OCTAVES = 5;
const float PERSISTANCE = 0.15;
const float FREQUENCY = 3.25;
const float LACUNARITY = 2.5;
const float OFFSET_SCALAR = 200.;

float frac(float v)
{
  return v - floor(v);
}
  
vec3 frac(vec3 v)
{
  return v - floor(v);
}
  
float hash(float n)
{
    return frac(sin(n)*43758.5453);
}

float lerp(float a, float b, float w)
{
  return a + w*(b-a);
}

float noise(vec3 x)
{
    // The noise function returns a value in the range -1.0f -> 1.0f

    vec3 p = floor(x);
    vec3 f = frac(x);

    f       = f*f*(3.0-2.0*f);
    
    float a = 1.;
    float b = 2.;
    float c = 3.;
    
    float n = p.x + p.y*a + b*p.z;

    return lerp(lerp(lerp( hash(n+0.0), hash(n+1.0),f.x),
                   lerp( hash(n+a), hash(n+a+1.),f.x),f.y),
               lerp(lerp( hash(n+b), hash(n+b+1.),f.x),
                   lerp( hash(n+c), hash(n+c+1.),f.x),f.y),f.z);
}

// basic noise builder, adding octaves into fractal noise
float fractal_noise(vec3 x3) {
  float val = 0.;
  float scale = 1.;
  float magnitude = 0.;
  float f = FREQUENCY;
  for( int i = 0; i < OCTAVES; i++ ) {
    val += scale * noise(x3 * f);
    magnitude += scale;
    scale *= PERSISTANCE;
    f *= LACUNARITY;
  }
  return val / magnitude;
}

void main() {
  vec2 uv = gl_FragCoord.xy / screenSize.xy;
  uv.x *= screenSize.x / screenSize.y;
  
  uv += vec2(${Math.random()} * OFFSET_SCALAR, ${Math.random()} * OFFSET_SCALAR);
  
  // you'd never notice if it repeated anyway, right?noice
  vec3 q3 = vec3(
    uv.xy * ZOOM / (screenSize.x / screenSize.y),
    totalTime * TIME_SCALAR
  );
  
  float f = fractal_noise(q3);
  
  f = abs(f);
  
  if (f < 0.45) {
    fragColor = vec4(vec3(.1).xyz, 1.);
  }
  else if (f < 0.55) {
    fragColor = vec4(vec3(.13).xyz, 1.);
  }
  else {
    fragColor = vec4(vec3(.2).xyz, 1.);
  }
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
    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
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
    this.totalTimeLocation = gl.getUniformLocation(
      this.shaderProgram,
      "totalTime",
    )!;
  }

  protected update(deltaTime: number): void {
    this.totalTime += deltaTime;
  }

  protected override prepareDrawVariables(
    gl: WebGLRenderingContext,
    _deltaTime: number,
  ): void {
    gl.uniform1f(this.totalTimeLocation, this.totalTime);
  }
}
