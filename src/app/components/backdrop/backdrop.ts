export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export abstract class Backdrop {
  public contextString(): string {
    return "2d";
  }

  public isInitialized: boolean = false;

  protected width: number;
  protected height: number;
  protected ctx: CanvasRenderingContext2D;
  public mousePosition: Vector2 = new Vector2(-1000, -1000);
  public mouseOffset: Vector2 = new Vector2(0, 0);
  protected lastUpdate: number;

  protected init(): void {}
  protected abstract update(deltaTime: number): void;
  protected abstract draw(deltaTime: number): void;

  public onDestroy(): void {}

  public initialize(
    ctx: RenderingContext,
    width: number,
    height: number,
  ): void {
    this.ctx = ctx as CanvasRenderingContext2D;
    this.width = width;
    this.height = height;
    this.lastUpdate = Date.now();

    this.setupListeners();
    this.init();
    this.isInitialized = true;
  }

  public reInitialize(): void {
    this.initialize(this.ctx, this.width, this.height);
  }

  protected setupListeners(): void {
    document.addEventListener("scroll", () => {
      const deltaOffset = new Vector2(
        window.scrollX - this.mouseOffset.x,
        window.scrollY - this.mouseOffset.y,
      );
      this.mouseOffset.x = window.scrollX;
      this.mouseOffset.y = window.scrollY;

      this.mousePosition.x += deltaOffset.x;
      this.mousePosition.y += deltaOffset.y;
    });
  }

  public clear(): void {
    (this.ctx as CanvasRenderingContext2D).clearRect(
      0,
      0,
      this.width,
      this.height,
    );
  }

  public tick(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    this.update(deltaTime);
    this.draw(deltaTime);
  }
}

export abstract class WebGLBackdrop extends Backdrop {
  // vertices for a quad (two triangles)
  private readonly vertices: number[] = [
    -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1,
  ];

  protected gl: WebGLRenderingContext;
  protected shaderProgram: WebGLProgram;
  private vert: WebGLProgram;
  private frag: WebGLProgram;

  public override contextString(): string {
    return "webgl2";
  }

  protected abstract getVertexShader(): string;
  protected abstract getFragmentShader(): string;
  protected abstract initializeDrawVariables(
    gl: WebGLRenderingContext,
    shaderProgram: WebGLProgram,
  ): void;

  public override initialize(
    ctx: RenderingContext,
    width: number,
    height: number,
  ): void {
    this.gl = ctx as WebGLRenderingContext;
    this.width = width;
    this.height = height;
    this.lastUpdate = Date.now();

    this.initWebGL(this.gl);
    super.setupListeners();
    this.init();
    this.isInitialized = true;
  }

  public override reInitialize(): void {
    this.initialize(this.gl, this.width, this.height);
  }

  protected override draw(deltaTime: number): void {
    this.prepareDrawVariables(this.gl, deltaTime);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);
  }
  protected abstract prepareDrawVariables(
    gl: WebGLRenderingContext,
    deltaTime: number,
  ): void;

  public override clear(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  private initWebGL(gl: WebGLRenderingContext): void {
    // Create a new buffer object
    var vertex_buffer = gl.createBuffer();
    if (vertex_buffer === null)
      throw new Error("Couldn't create vertex buffer!");

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.DYNAMIC_DRAW,
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    if (this.vert) {
      gl.deleteShader(this.vert);
    }
    if (this.frag) {
      gl.deleteShader(this.frag);
    }
    [this.vert, this.frag] = this.compileWebGLShaders(
      gl,
      this.getVertexShader(),
      this.getFragmentShader(),
    );

    this.createAndBindShaderProgram(gl, this.vert, this.frag);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    this.initializeDrawVariables(gl, this.shaderProgram);

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    this.clear();
    gl.viewport(0, 0, this.width, this.height);
  }

  public compileWebGLShaders(
    gl: WebGLRenderingContext,
    vertCode: string,
    fragCode: string,
  ): [vertexShader: WebGLShader, fragmentShader: WebGLShader] {
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (vertShader === null) {
      throw new Error("Failed To Create Vertex Shader!");
    }
    if (fragShader === null) {
      throw new Error("Failed To Create Fragment Shader!");
    }
    gl.shaderSource(vertShader, vertCode);
    gl.shaderSource(fragShader, fragCode);

    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      throw new Error(
        "Error compiling vertex shader\n" + gl.getShaderInfoLog(vertShader),
      );
    }
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new Error(
        "Error compiling fragment shader\n" + gl.getShaderInfoLog(fragShader),
      );
    }
    return [vertShader, fragShader];
  }

  private createAndBindShaderProgram(
    gl: WebGLRenderingContext,
    vert: WebGLShader,
    frag: WebGLShader,
  ) {
    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) {
      throw new Error("Failed To Create Shader Program!");
    }
    gl.attachShader(shaderProgram, vert);
    gl.attachShader(shaderProgram, frag);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    if (this.shaderProgram) {
      gl.deleteProgram(this.shaderProgram);
    }
    this.shaderProgram = shaderProgram;
  }

  public override onDestroy(): void {
    const gl = this.gl;
    if (this.shaderProgram) {
      gl.deleteProgram(this.shaderProgram);
    }
    if (this.vert) {
      gl.deleteShader(this.vert);
    }
    if (this.frag) {
      gl.deleteShader(this.frag);
    }
  }
}
