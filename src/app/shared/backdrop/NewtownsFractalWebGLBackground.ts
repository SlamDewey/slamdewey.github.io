import { WebGLBackdrop } from "./backdrop";

export class NewtownsFractalWebGLBackground extends WebGLBackdrop {

  protected init(): void {
  }

  readonly VertexShader: string = `
  precision mediump float;

  attribute vec2 coordinates;
  
  void main() {
    gl_Position = vec4(coordinates.xy, 0.0, 1.0);
  }
  `;
  readonly FragmentShader: string = `
  precision mediump float;
  
  const int MAX_ITERATIONS = 12;
  const float PI = 3.14159;
  const float brightness = 0.8;
  
  uniform vec2 screenSize;
  uniform float time;

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
  
  vec2 g(vec2 x) {
    return complex_pow(x, vec2(6.0, 0.0)) + complex_pow(x, vec2(3.0, 0.0)) - vec2(1.0, 0.0);
  }
  vec2 gp(vec2 x) {
    return complex_mul(vec2(6.0, 0.0), complex_pow(x, vec2(5.0, 0.0))) + complex_mul(vec2(3.0, 0.0), complex_pow(x, vec2(2.0, 0.0)));
  }
  
  vec2 newtonsMethod(int function, vec2 x0, vec2 iterationOffset) {
    vec2 xn = x0;
    if (function == 1) {
      for (int n = 0; n < MAX_ITERATIONS; n++) {
        xn = xn - complex_div(f(xn), fp(xn)) + iterationOffset;
        //xn = xn - complex_div(f(xn), fp(xn));
      }
    }
    else if (function == 2) {
      for (int n = 0; n < MAX_ITERATIONS; n++) {
        xn = xn - complex_div(g(xn), gp(xn)) + iterationOffset;
        //xn = xn - complex_div(g(xn), gp(xn));
      }
    }
    else {
      return vec2(0.0);
    }
    return xn;
  }
  
  void fColor(vec2 iterated_location) {
    vec2 uv = gl_FragCoord.xy / screenSize.xy;
    
    float dist1 = complex_sqdist(iterated_location, vec2(-0.5, 0.866));
    float dist2 = complex_sqdist(iterated_location, vec2(-0.5, -0.866));
    float dist3 = complex_sqdist(iterated_location, vec2(1.0, 0.0));
    
    if (dist1 < dist2 && dist1 < dist3) {
      //gl_FragColor = vec4(250.0, 160.0, 95.0, 256.0) / vec4(256.0);
      gl_FragColor = vec4(uv.x * brightness, 0.0, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
    }
    else if (dist2 < dist1 && dist2 < dist3) {
      //gl_FragColor = vec4(190.0, 110.0, 50.0, 256.0) / vec4(256.0);
      gl_FragColor = vec4(0.0, uv.y * brightness, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
    }
    else if (dist3 < dist1 && dist3 < dist2) {
      //gl_FragColor = vec4(220.0, 110.0, 15.0, 256.0) / vec4(256.0);
      gl_FragColor = vec4(uv.xy * brightness, ((cos(time) + 1.0) / 2.0) * brightness, 1.0);
    }
    else {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  }
  void gColor(vec2 iterated_location) {
    vec2 uv = gl_FragCoord.xy / screenSize.xy;
    
    float r = 0.85179964207;
    float r_sqrt3over2 = 0.73768012896;
    float half_r = 0.42589982103;
    
    float t = -1.17398499671;
    float t_sqrt3over2 = -1.01670083081;
    float half_t = 0.58699249835;
    
    float dist1 = complex_sqdist(iterated_location, vec2(r, 0.0));
    float dist2 = complex_sqdist(iterated_location, vec2(-half_r, r_sqrt3over2));
    float dist3 = complex_sqdist(iterated_location, vec2(-half_r, -r_sqrt3over2));
    float dist4 = complex_sqdist(iterated_location, vec2(t, 0.0));
    float dist5 = complex_sqdist(iterated_location, vec2(-half_t, t_sqrt3over2));
    float dist6 = complex_sqdist(iterated_location, vec2(-half_t, -t_sqrt3over2));
    
    
    float test = dist1;
    if (test <= dist1 && test <= dist2 && test <= dist3 && test <= dist4 && test <= dist5 && test <= dist6) {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      //gl_FragColor = vec4(((sin(time) + 1.0) / 2.0) * brightness, 0.0, ((cos(time) + 1.0) / 2.0) * brightness, 1.0);
      return;
    }
    test = dist2;
    if (test <= dist1 && test <= dist2 && test <= dist3 && test <= dist4 && test <= dist5 && test <= dist6) {
      gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      //gl_FragColor = vec4(((sin(time) + 1.0) / 2.0) * brightness, ((cos(time) + 1.0) / 2.0) * brightness, 0.0, 1.0);
      return;
    }
    test = dist3;
    if (test <= dist1 && test <= dist2 && test <= dist3 && test <= dist4 && test <= dist5 && test <= dist6) {
      gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      //gl_FragColor = vec4(0.0, ((sin(time) + 1.0) / 2.0) * brightness, ((cos(time) + 1.0) / 2.0) * brightness, 1.0);
      return;
    }
    test = dist4;
    if (test <= dist1 && test <= dist2 && test <= dist3 && test <= dist4 && test <= dist5 && test <= dist6) {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
      //gl_FragColor = vec4(((cos(time) + 1.0) / 2.0) * brightness, 0.0, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
      return;
    }
    test = dist5;
    if (test <= dist1 && test <= dist2 && test <= dist3 && test <= dist4 && test <= dist5 && test <= dist6) {
      gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
      //gl_FragColor = vec4(((cos(time) + 1.0) / 2.0) * brightness, ((sin(time) + 1.0) / 2.0) * brightness, 0.0, 1.0);
      return;
    }
    test = dist6;
    if (test <= dist1 && test <= dist2 && test <= dist3 && test <= dist4 && test <= dist5 && test <= dist6) {
      gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
      //gl_FragColor = vec4(0.0, ((cos(time) + 1.0) / 2.0) * brightness, ((sin(time) + 1.0) / 2.0) * brightness, 1.0);
      return;
    }
    
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
  
  void colorFrag(int function, vec2 iterated_location) {
    if (function == 1) {
      fColor(iterated_location);
    }
    else if (function == 2) {
      gColor(iterated_location);
    }
    else {
      gl_FragColor = vec4(gl_FragCoord.xy / screenSize.xy, (sin(time) + 1.0) / 2.0, 1.0);
    }
  }
  
  void main() {
    vec2 relCoordinate = (gl_FragCoord.xy - (screenSize.xy / 2.0)) / (screenSize.x);
    
    //float scalar = 10.0 * ((sin(time / 5.0) + 1.0) / 2.0);
    float scalar = 10.0 * ((-cos(time / 15.0) + 1.0) / 2.0);
    //float scalar = 5.0;
    
    int function = 2;
    
    vec2 iterated_location = newtonsMethod(function, relCoordinate * scalar, -vec2(0.2 * sin(time / 2.0), 0.2 * cos(time / 2.0)));
    //vec2 iterated_location = newtonsMethod(function, relCoordinate * scalar, vec2(0.0, 0.0));
    //vec2 iterated_location = newtonsMethod(function, relCoordinate * scalar, vec2(sin(time) * 0.2, 0.0));
    colorFrag(function, iterated_location);
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