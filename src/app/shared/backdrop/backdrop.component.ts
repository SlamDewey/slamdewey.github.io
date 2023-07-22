import { Component, ViewEncapsulation, ElementRef, ViewChild, Input } from '@angular/core';
import { Backdrop } from './backdrop';

@Component({
  selector: 'backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackdropComponent {

  @ViewChild('bgCanvas') bgCanvas: ElementRef;

  @Input() backdrop: Backdrop;
  @Input() shouldPauseAnimation: boolean;
  @Input() isServingAsBackdrop: boolean = true;

  public static isWebGlEnabled: boolean;

  public RefreshRateMS = 1000 / 90;
  public InternalCanvasRenderSize: { X: number, Y: number };

  private canvasElement: HTMLCanvasElement;
  private ctx: RenderingContext;
  private renderInterval: any;
  private resizeObserver: ResizeObserver;

  constructor() {
    const e = document.createElement('canvas');
    BackdropComponent.isWebGlEnabled = (!!window.WebGLRenderingContext) || (!!e.getContext('webgl') || !!e.getContext('experimental-webgl'));
  }

  ngOnDestroy() {
    clearInterval(this.renderInterval);
    this.resizeObserver?.disconnect();
  }

  ngAfterViewInit(): void {
    this.canvasElement = this.bgCanvas.nativeElement;

    // define resize observer
    this.resizeObserver = new ResizeObserver(entries => {
      console.log("RESIZE_START");
      this.canvasElement = this.bgCanvas.nativeElement;

      const context = this.canvasElement.getContext(this.backdrop.contextString());
      if (!context) {
        throw new Error('Failed to get 2D context of Canvas');
      }
      this.ctx = context;
      if (this.isServingAsBackdrop) {
        this.InternalCanvasRenderSize = {
          X: entries[0].target.clientWidth,
          Y: Math.max(entries[0].target.clientHeight, window.innerHeight)
        }
      }
      else {
        console.log(entries);
        this.InternalCanvasRenderSize = {
          X: entries[0].contentRect.width,
          Y: entries[0].contentRect.height
        }
      }

      this.ctx.canvas.width = this.InternalCanvasRenderSize.X;
      this.ctx.canvas.height = this.InternalCanvasRenderSize.Y;

      this.backdrop.initialize(this.ctx, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);
      console.log("RESIZE_END");
    });
    // initialize
    this.resizeObserver.observe(this.isServingAsBackdrop ? document.body : this.canvasElement);

    this.renderInterval = setInterval(async () => { await this.renderLoop() }, this.RefreshRateMS);
  }

  public renderLoop(): void {
    if (this.shouldPauseAnimation || !this.backdrop.isInitialized)
      return;
    this.backdrop.clear();
    this.backdrop.tick();
  }
}
