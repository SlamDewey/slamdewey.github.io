export class ShaderProgramData {
  public name: string;
  public url: string;
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
// string copied into actual shader code
export const UNIFORM_DEFS: string = `
// This is the data I provide all shaders with:
uniform vec2 screenSize;    // screen size in pixels
uniform vec2 mousePosition; // cursor position in pixels
uniform float totalTime;    // time since start
uniform float deltaTime;    // time since last frame
// editing code above this line could result in errors
`;
// used for context highlighting inside monaco editor
export const UNIFORM_NAMES: string[] = ['screenSize', 'mousePosition', 'totalTime', 'deltaTime'];

export const UV_SHADER: ShaderProgramData = {
  name: 'UV Coordinates',
  url: 'uv',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
void main() {
\t// normalized coordinates
\tvec2 uv = gl_FragCoord.xy / screenSize.xy;
\t// set output color
\tgl_FragColor = vec4(uv.xy, 0.0, 1.0);
}`
}
export const SHADER_TOY_UV: ShaderProgramData = {
  name: 'Shadertoy UV',
  url: 'suv',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
void main() {
\tvec2 uv = gl_FragCoord.xy / screenSize.xy;
\tvec3 color = 0.5 + 0.5 * cos(totalTime + uv.xyy + vec3(0, 2, 4));
\tgl_FragColor = vec4(color.xyz, 1.0);
}`
}
export const MOUSE_POSITION_EXAMPLE: ShaderProgramData = {
  name: 'MousePosition Example',
  url: 'mouse_example',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
float dist(vec2 a, vec2 b) {
\treturn sqrt(pow(a.x - b.x, 2.0) + pow(a.y - b.y, 2.0));
}
void main() {
\tvec2 relativePixelPos = gl_FragCoord.xy / screenSize.xy;
\tvec2 relativeMousePos = mousePosition.xy / screenSize.xy;
\t// in GLSL, the bottom left is (0, 0) and top right is (1, 1)
\t// so 0.05 as a distance represents 1/20th of the screen size
\t// notice, using screen size makes an ellipse
\tif (dist(relativeMousePos, relativePixelPos) < 0.05) {
\t\tgl_FragColor = vec4(0);
\t}
\telse {
\t\tgl_FragColor = vec4(relativePixelPos.xy, 0.0, 1.0);
\t}
}`
}
export const BASIC_NEWTONS_FRACTAL_SHADER: ShaderProgramData = {
  name: 'Newton\'s Fractal',
  url: 'newtons_fractal_basic',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
const int NUM_ITERATIONS = 20;
const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

vec2 complex_mul(vec2 a, vec2 b) {
\treturn vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
vec2 complex_div(vec2 a, vec2 b) {
\tfloat den = pow(b.x, 2.0) + pow(b.y, 2.0);
\treturn vec2((a.x * b.x + a.y * b.y) / den, (a.y * b.x - a.x * b.y) / den);
}
float squared_distance(vec2 a, vec2 b) {
\treturn pow(a.x - b.x, 2.0) + pow(a.y - b.y, 2.0);
}
vec2 complex_pow(vec2 x, vec2 e) {
\tfloat r = sqrt(pow(x.x, 2.0) + pow(x.y, 2.0));
\tfloat theta = atan(x.y, x.x);
\tfloat xc = pow(r, e.x) * exp(-e.y * theta);
\tfloat yc = e.x * theta + e.y * log(r);
\treturn vec2(xc * cos(yc), xc * sin(yc));
}
vec2 f(vec2 x) {
\treturn complex_pow(x, vec2(3.0, 0.0)) - vec2(1.0, 0.0);
}
vec2 fp(vec2 x) {
\treturn complex_mul(vec2(3.0, 0.0), complex_pow(x, vec2(2.0, 0.0)));
}
vec2 newtonsMethod(vec2 x0, vec2 iterationOffset) {
\tvec2 xn = x0;
\tfor (int n = 0; n < NUM_ITERATIONS; n++) {
\t\txn = xn - complex_div(f(xn), fp(xn)) + iterationOffset;
\t}
\treturn xn;
}
void choose_color(vec2 iterated_location) {
\tvec2 uv = gl_FragCoord.xy / screenSize.xy;
\t
\tfloat dist1 = squared_distance(iterated_location, vec2(-0.5, 0.866));
\tfloat dist2 = squared_distance(iterated_location, vec2(-0.5, -0.866));
\tfloat dist3 = squared_distance(iterated_location, vec2(1.0, 0.0));
\t
\tif (dist1 < dist2 && dist1 < dist3) {
\t\tgl_FragColor = RED;
\t}
\telse if (dist2 < dist1 && dist2 < dist3) {
\t\tgl_FragColor = GREEN;
\t}
\telse if (dist3 < dist1 && dist3 < dist2) {
\t\tgl_FragColor = BLUE;
\t}
\telse {
\t\tgl_FragColor = BLACK;
\t}
}

void main() {
\tvec2 relCoordinate = (gl_FragCoord.xy - (screenSize.xy / 2.0)) / (screenSize.x);
\tfloat scalar = 3.0;
\tvec2 locationInput = vec2(0.0, 0.0);
\tvec2 iterated_location = newtonsMethod(relCoordinate * scalar, locationInput);
\t
\tchoose_color(iterated_location);
}`
}
export const ANIMATED_NEWTONS_FRACTAL_SHADER: ShaderProgramData = {
  name: 'Animated Newton\'s Fractal Example',
  url: 'newtons_fractal_animated',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
const int NUM_ITERATIONS = 20;
const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

vec2 complex_mul(vec2 a, vec2 b) {
\treturn vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
vec2 complex_div(vec2 a, vec2 b) {
\tfloat den = pow(b.x, 2.0) + pow(b.y, 2.0);
\treturn vec2((a.x * b.x + a.y * b.y) / den, (a.y * b.x - a.x * b.y) / den);
}
float squared_distance(vec2 a, vec2 b) {
\treturn pow(a.x - b.x, 2.0) + pow(a.y - b.y, 2.0);
}
vec2 complex_pow(vec2 x, vec2 e) {
\tfloat r = sqrt(pow(x.x, 2.0) + pow(x.y, 2.0));
\tfloat theta = atan(x.y, x.x);
\tfloat xc = pow(r, e.x) * exp(-e.y * theta);
\tfloat yc = e.x * theta + e.y * log(r);
\treturn vec2(xc * cos(yc), xc * sin(yc));
}
vec2 f(vec2 x) {
\treturn complex_pow(x, vec2(3.0, 0.0)) - vec2(1.0, 0.0);
}
vec2 fp(vec2 x) {
\treturn complex_mul(vec2(3.0, 0.0), complex_pow(x, vec2(2.0, 0.0)));
}
vec2 newtonsMethod(vec2 x0, vec2 iterationOffset) {
\tvec2 xn = x0;
\tfor (int n = 0; n < NUM_ITERATIONS; n++) {
\t\txn = xn - complex_div(f(xn), fp(xn)) + iterationOffset;
\t}
\treturn xn;
}
void choose_color(vec2 iterated_location) {
\tvec2 uv = gl_FragCoord.xy / screenSize.xy;
\t
\tfloat dist1 = squared_distance(iterated_location, vec2(-0.5, 0.866));
\tfloat dist2 = squared_distance(iterated_location, vec2(-0.5, -0.866));
\tfloat dist3 = squared_distance(iterated_location, vec2(1.0, 0.0));
\t
\tif (dist1 < dist2 && dist1 < dist3) {
\t\tgl_FragColor = RED;
\t}
\telse if (dist2 < dist1 && dist2 < dist3) {
\t\tgl_FragColor = GREEN;
\t}
\telse if (dist3 < dist1 && dist3 < dist2) {
\t\tgl_FragColor = BLUE;
\t}
\telse {
\t\tgl_FragColor = BLACK;
\t}
}

void main() {
\tvec2 relCoordinate = (gl_FragCoord.xy - (screenSize.xy / 2.0)) / (screenSize.x);
\tfloat radiusScalar = 0.35;
\tfloat timeScalar = 0.6;
\tfloat time = totalTime * timeScalar;
\t
\tfloat coordinateScalar = 2.0 * (sin(time) + 1.5);
\tvec2 locationInput = vec2(sin(time) * radiusScalar, cos(time) * radiusScalar);
\tvec2 iterated_location = newtonsMethod(relCoordinate * coordinateScalar, locationInput);
\t
\tchoose_color(iterated_location);
}`
}
export const MOUSE_POSITION_NEWTONS_FRACTAL_SHADER: ShaderProgramData = {
  name: 'MousePosition Example With Newton\'s Fractal',
  url: 'newtons_fractal_mouse',
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader: `
const int NUM_ITERATIONS = 10;
const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

vec2 complex_mul(vec2 a, vec2 b) {
\treturn vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
vec2 complex_div(vec2 a, vec2 b) {
\tfloat den = pow(b.x, 2.0) + pow(b.y, 2.0);
\treturn vec2((a.x * b.x + a.y * b.y) / den, (a.y * b.x - a.x * b.y) / den);
}
float squared_distance(vec2 a, vec2 b) {
\treturn pow(a.x - b.x, 2.0) + pow(a.y - b.y, 2.0);
}
vec2 complex_pow(vec2 x, vec2 e) {
\tfloat r = sqrt(pow(x.x, 2.0) + pow(x.y, 2.0));
\tfloat theta = atan(x.y, x.x);
\tfloat xc = pow(r, e.x) * exp(-e.y * theta);
\tfloat yc = e.x * theta + e.y * log(r);
\treturn vec2(xc * cos(yc), xc * sin(yc));
}
vec2 f(vec2 x) {
\treturn complex_pow(x, vec2(3.0, 0.0)) - vec2(1.0, 0.0);
}
vec2 fp(vec2 x) {
\treturn complex_mul(vec2(3.0, 0.0), complex_pow(x, vec2(2.0, 0.0)));
}
vec2 newtonsMethod(vec2 x0, vec2 iterationOffset) {
\tvec2 xn = x0;
\tfor (int n = 0; n < NUM_ITERATIONS; n++) {
\t\txn = xn - complex_div(f(xn), fp(xn)) + iterationOffset;
\t}
\treturn xn;
}
void choose_color(vec2 iterated_location) {
\tvec2 uv = gl_FragCoord.xy / screenSize.xy;
\t
\tfloat dist1 = squared_distance(iterated_location, vec2(-0.5, 0.866));
\tfloat dist2 = squared_distance(iterated_location, vec2(-0.5, -0.866));
\tfloat dist3 = squared_distance(iterated_location, vec2(1.0, 0.0));
\t
\tif (dist1 < dist2 && dist1 < dist3) {
\t\tgl_FragColor = RED;
\t}
\telse if (dist2 < dist1 && dist2 < dist3) {
\t\tgl_FragColor = GREEN;
\t}
\telse if (dist3 < dist1 && dist3 < dist2) {
\t\tgl_FragColor = BLUE;
\t}
\telse {
\t\tgl_FragColor = BLACK;
\t}
}

void main() {
\tvec2 relCoordinate = (gl_FragCoord.xy - (screenSize.xy / 2.0)) / (screenSize.x);
\tfloat radiusScalar = 0.35;
\tfloat timeScalar = 0.6;
\tfloat time = totalTime * timeScalar;
\t
\tfloat coordinateScalar = 2.0;
\t
\t// get origin-adjusted, screen-relative mouse pos for location input
\tvec2 locationInput = (mousePosition.xy - (screenSize.xy / 2.0)) / screenSize.xy;
\t// get iterated location
\tvec2 iterated_location = newtonsMethod(relCoordinate * coordinateScalar, locationInput);
\t// color by distance to nearest sector
\tchoose_color(iterated_location);
}`
}

export const DEFAULT_SHADER_PROGRAMS: ShaderProgramData[] = [
  UV_SHADER,
  SHADER_TOY_UV,
  MOUSE_POSITION_EXAMPLE,
  BASIC_NEWTONS_FRACTAL_SHADER,
  ANIMATED_NEWTONS_FRACTAL_SHADER,
  MOUSE_POSITION_NEWTONS_FRACTAL_SHADER
]