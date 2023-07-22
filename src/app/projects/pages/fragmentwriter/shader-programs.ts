
export class ShaderProgramData {
  public name: string;
  public vertexShader: string;
  public fragmentShader: string;
}

export const SHADER_HEADER: string = `precision mediump float;\n`

export const DEFAULT_VERTEX_SHADER: string = SHADER_HEADER + `
attribute vec2 coordinates;

void main() {
  gl_Position = vec4(coordinates.xy, 0.0, 1.0);
}
`

export const UNIFORM_DEFS: string = `
uniform vec2 screenSize;
uniform float totalTime;
uniform float deltaTime;
`;
export const UNIFORM_NAMES: string[] = ['screenSize', 'totalTime', 'deltaTime'];

export const UV_SHADER: ShaderProgramData = {
  name: 'UV Coordinate Shader',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
void main() {
  vec2 uv = gl_FragCoord.xy / screenSize.xy;
  gl_FragColor = vec4(uv.xy, 0.0, 1.0);
}`
}

export const BASIC_NEWTONS_FRACTAL_SHADER: ShaderProgramData = {
  name: 'Newton\'s Fractal',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
const int NUM_ITERATIONS = 20;
const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

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
  for (int n = 0; n < NUM_ITERATIONS; n++) {
    xn = xn - complex_div(f(xn), fp(xn)) + iterationOffset;
  }
  return xn;
}
void choose_color(vec2 iterated_location) {
  vec2 uv = gl_FragCoord.xy / screenSize.xy;
  
  float dist1 = complex_sqdist(iterated_location, vec2(-0.5, 0.866));
  float dist2 = complex_sqdist(iterated_location, vec2(-0.5, -0.866));
  float dist3 = complex_sqdist(iterated_location, vec2(1.0, 0.0));
  
  if (dist1 < dist2 && dist1 < dist3) {
    gl_FragColor = RED;
  }
  else if (dist2 < dist1 && dist2 < dist3) {
    gl_FragColor = GREEN;
  }
  else if (dist3 < dist1 && dist3 < dist2) {
    gl_FragColor = BLUE;
  }
  else {
    gl_FragColor = BLACK;
  }
}

void main() {
  vec2 relCoordinate = (gl_FragCoord.xy - (screenSize.xy / 2.0)) / (screenSize.x);
  float scalar = 3.0;
  vec2 locationInput = vec2(0.0, 0.0);
  vec2 iterated_location = newtonsMethod(relCoordinate * scalar, locationInput);
  
  choose_color(iterated_location);
}`
}

export const DEFAULT_SHADER_PROGRAMS: ShaderProgramData[] = [
  UV_SHADER,
  BASIC_NEWTONS_FRACTAL_SHADER,
]