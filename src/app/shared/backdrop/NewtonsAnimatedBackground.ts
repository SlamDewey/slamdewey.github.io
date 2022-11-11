import { Backdrop, Vector2 } from "./backdrop";

const COLORS = [
  '#fb8537',
  '#fb9550'
];
const EPSILON = 0.0000001;

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function lerp(start: number, end: number, percentage: number) {
  return (1 - percentage) * start + percentage * end;
}
const complex_mul = ([a, b]: number[], [c, d]: number[]) => [a * c - b * d, a * d + b * c]
const complex_sub = ([a, b]: number[], [c, d]: number[]) => [a - c, b - d]
const complex_add = ([a, b]: number[], [c, d]: number[]) => [a + c, b + d]
const complex_sqdist = ([a, b]: number[], [c, d]: number[]) => (a - c) ** 2 + (b - d) ** 2

const complex_div = ([a, b]: number[], [c, d]: number[]) => {
  let den = c ** 2 + d ** 2
  return [(a * c + b * d) / den, (b * c - a * d) / den]
}

const complex_pow = ([a, b]: number[], [c, d]: number[]) => {
  let r = Math.sqrt(a ** 2 + b ** 2)
  let theta = Math.atan2(b, a)
  let x = r ** c * Math.exp(-d * theta)
  let y = c * theta + d * Math.log(r)
  return [x * Math.cos(y), x * Math.sin(y)]
}

export class NewtonsAnimatedBackground extends Backdrop {

  private canvasData: ImageData;
  private time: number = 0;

  readonly f_norm = (x: number[]) => complex_add(complex_pow(x, [3, 0]), [1, 0]);
  readonly fprime = (x: number[]) => complex_mul([3, 0], complex_pow(x, [3 - 1, 0]));

  readonly g = (x: number[]) => complex_add(complex_sub(complex_add(complex_pow(x, [5, 0]), complex_pow(x, [2, 0])), x), [1, 0])
  readonly gp = (x: number[]) => complex_sub(complex_add(complex_mul([5, 0], complex_pow(x, [4, 0])), complex_mul([2, 0], x)), [1, 0]);

  init(): void {
    this.canvasData = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  update(deltaTime: number): void {

  }

  private ticker: number = 0;

  draw(deltaTime: number): void {
    this.time = Math.sin(this.ticker++ / 10) / 2 + 3;
    //this.drawNewtonianFractal(3);
    //this.drawNewtonianFractal(5);
    //this.drawMandlebrotSet(Math.round(this.time));
    //this.drawMandlebrotSet(240);
  }

  private newtonsMethod(f: (x: number[]) => number[], fp: (x: number[]) => number[], x0: number[], max_iteration: number) {
    let xn = x0;
    for (let n = 0; n < max_iteration; n++) {
      xn = complex_sub(xn, complex_div(f(xn), fp(xn)))
    }
    return xn
  }

  private drawNewtonianFractal(max_iteration: number = 10) {
    const scalar = 6;
    let downscaleWidth = this.width / scalar;
    let downscaleHeight = this.height / scalar;

    for (let x = 0; x < downscaleWidth; x++) {
      for (let y = 0; y < downscaleHeight; y++) {
        let pos = [
          (x - downscaleWidth / 2) / downscaleWidth,
          (y - downscaleHeight / 2) / downscaleHeight,
        ];
        let rgb = "rgb(0, 0, 0)";

        // Perform newton's method on the position
        let convergingRoot = this.newtonsMethod(this.g, this.gp, pos, max_iteration);

        // Set color based on root it diverges to
        if (complex_sqdist(convergingRoot, [0.5, 0.866]) <= 0.1) {
          rgb = "rgb(255, 0, 0)";
        } else if (complex_sqdist(convergingRoot, [0.5, -0.866]) <= 0.1) {
          rgb = "rgb(0, 255, 0)";
        } else if (complex_sqdist(convergingRoot, [-1, 0]) <= 0.1) {
          rgb = "rgb(0, 0, 255)";
        }
        // Draw the pixel
        //this.drawPixel(x * scalar, y * scalar, rgb[0], rgb[1], rgb[2], 255);
        this.ctx.fillStyle = rgb;
        this.ctx.fillRect(x * scalar, y * scalar, scalar, scalar);
      }
    }
  }

  private drawMandlebrotSet(max_iteration: number = 10) {
    let width = 3.5;
    let height = 2;
    let xoffset = 0;
    let yoffset = 0;

    for (let px = 0; px < this.width; px++) {
      for (let py = 0; py < this.height; py++) {

        var x0 = (px / this.width) * width + (xoffset - 2.5);
        var y0 = (py / this.height) * height + (yoffset - 1);
        var x = 0;
        var y = 0;
        var iter = 0;

        while ((x * x + y * y) < 4 && iter < max_iteration) {
          var x_temp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = x_temp;
          iter++;
        }

        var rgb = this.hToRgb(iter / max_iteration);
        this.drawPixel(px, py, rgb[0], rgb[1], rgb[2], 255);
      }
    }
    this.ctx.putImageData(this.canvasData, 0, 0);
  }

  private drawPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
    var index = (x + y * this.width) * 4;

    this.canvasData.data[index + 0] = r;
    this.canvasData.data[index + 1] = g;
    this.canvasData.data[index + 2] = b;
    this.canvasData.data[index + 3] = a;
  }

  //Convert hue value to rgb
  private hToRgb(h: number) {
    if (h == 1)
      return [0, 0, 0];
    var r = 0, g = 0, b = 0;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    switch (i % 6) {
      case 0: r = 1, g = f, b = 0; break;
      case 1: r = f, g = 1, b = 0; break;
      case 2: r = 0, g = 1, b = f; break;
      case 3: r = 0, g = f, b = 1; break;
      case 4: r = f, g = 0, b = 1; break;
      case 5: r = 1, g = 0, b = f; break;
    }
    return [r * 255, g * 255, b * 255];
  }
}