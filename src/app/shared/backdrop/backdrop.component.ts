import { Component, ViewEncapsulation, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Backdrop } from './backdrop';

@Component({
  selector: 'backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackdropComponent implements OnInit, OnChanges {

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

  ngOnInit(): void {
    this.calculateCanvasSize();
  }

  private calculateCanvasSize() {
  }

  ngOnChanges(): void {
    if (this.ctx)
      this.backdrop.initialize(this.ctx, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);
  }

  ngOnDestroy() {
    clearInterval(this.renderInterval);
    this.resizeObserver?.disconnect();
  }

  ngAfterViewInit(): void {
    // disable right click on canvas
    this.canvasElement = this.bgCanvas.nativeElement;

    const context = this.canvasElement.getContext(this.backdrop.contextString());
    if (!context) {
      throw new Error('Failed to get 2D context of Canvas');
    }
    this.ctx = context;

    if (this.isServingAsBackdrop) {
      this.bgCanvas.nativeElement.addEventListener('contextmenu', (e: Event) => { e.preventDefault(); });
      this.InternalCanvasRenderSize = {
        X: document.documentElement.scrollWidth,
        Y: Math.max(document.documentElement.scrollHeight, window.innerHeight)
      };
      this.resizeObserver = new ResizeObserver(entries => {
        this.InternalCanvasRenderSize.X = entries[0].target.clientWidth;
        this.InternalCanvasRenderSize.Y = Math.max(entries[0].target.clientHeight, window.innerHeight);

        this.ctx.canvas.width = this.InternalCanvasRenderSize.X;
        this.ctx.canvas.height = this.InternalCanvasRenderSize.Y;
        this.backdrop.initialize(this.ctx as CanvasRenderingContext2D, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);
      });

      this.resizeObserver.observe(document.body);
    }
    else {
      this.InternalCanvasRenderSize = {
        X: this.canvasElement.width,
        Y: this.canvasElement.height
      }
    }

    this.backdrop.initialize(this.ctx, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);
    this.renderInterval = setInterval(async () => { await this.renderLoop() }, this.RefreshRateMS);
  }

  public renderLoop(): void {
    if (this.shouldPauseAnimation)
      return;
    this.backdrop.clear();
    this.backdrop.tick();
  }
}
