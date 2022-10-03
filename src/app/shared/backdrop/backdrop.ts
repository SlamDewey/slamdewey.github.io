export abstract class Backdrop {

  public width: number;
  public height: number;
  public ctx: CanvasRenderingContext2D;
  protected mousePosition: Vector2;
  private mouseOffset: Vector2 = new Vector2(0, 0);

  private lastUpdate: number;

  public initialize(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.lastUpdate = Date.now();

    document.addEventListener('mousemove', (e) => {
      this.mousePosition = new Vector2(this.mouseOffset.x + e.clientX, this.mouseOffset.y + e.clientY);
    });
    document.addEventListener('scroll', (e) => {
      const deltaOffset = new Vector2(window.scrollX - this.mouseOffset.x, window.scrollY - this.mouseOffset.y);
      this.mouseOffset.x = window.scrollX;
      this.mouseOffset.y = window.scrollY;
      if (this.mousePosition !== undefined)
        this.mousePosition = new Vector2(deltaOffset.x + this.mousePosition.x, deltaOffset.y + this.mousePosition.y);
    });

    this.init();
  }

  protected abstract init(): void;
  protected abstract update(deltaTime: number): void;
  protected abstract draw(deltaTime: number): void;

  public tick(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    this.update(deltaTime);
    this.draw(deltaTime);
  }
}

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}